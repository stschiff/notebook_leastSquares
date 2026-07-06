import { dgels } from './dgels.browser.js'

export function readBimData(bimText) {
    const lines = bimText.trim().split('\n');
    const nrSNPs = lines.length;
    let chromosomes = new Uint8Array(nrSNPs);
    let positions = new Uint32Array(nrSNPs);
    let snpIDs = new Array(nrSNPs);
    let alleles1 = new Uint8Array(nrSNPs);
    let alleles2 = new Uint8Array(nrSNPs);
    for (let i = 0; i < nrSNPs; i++) {
        const fields = lines[i].trim().split(/\s+/);
        chromosomes[i] = parseInt(fields[0]);
        if (isNaN(chromosomes[i]) || chromosomes[i] < 1 || chromosomes[i] > 25) {
            throw new Error(`Invalid chromosome for SNP ${snpIDs[i]}: ${fields[0]}`);
        }
        snpIDs[i] = fields[1];
        positions[i] = parseInt(fields[3]);
        if (isNaN(positions[i])) {
            throw new Error(`Invalid position for SNP ${snpIDs[i]}: ${fields[3]}`);
        }
        alleles1[i] = fields[4].charCodeAt(0);
        alleles2[i] = fields[5].charCodeAt(0);
    }
    console.log(`Loaded ${nrSNPs} SNPs from BIM file.`);
    return { snpIDs, chromosomes, positions, alleles1, alleles2 };
}

export function readFamData(famText) {
    const lines = famText.trim().split('\n');
    const nrSamples = lines.length;
    let popNames = new Array(nrSamples);
    let indNames = new Array(nrSamples);
    for (let i = 0; i < nrSamples; i++) {
        const fields = lines[i].trim().split(/\s+/);
        popNames[i] = fields[0];
        indNames[i] = fields[1];
    }
    console.log(`Loaded ${nrSamples} individuals from FAM file.`);
    return { indNames, popNames };
}
  
export function readBedData(bedArrayBuffer, numSnps, numInds) {
    const bytes = new Uint8Array(bedArrayBuffer);
    if (bytes.length < 3 || bytes[0] !== 0b01101100 || bytes[1] !== 0b00011011 || bytes[2] !== 0b00000001) {
        throw new Error("Invalid .bed file: incorrect magic numbers");
    }
    let returnArray = new Uint8Array(numSnps * numInds);
    let blockSize = Math.ceil(numInds / 4);
    for (let i = 0; i < numSnps; i++) {
        for (let j = 0; j < numInds; j++) {
            const byteIndex = 3 + i * blockSize + Math.floor(j / 4);
            const bitOffset = (j % 4) * 2;
            const genotypeBits = (bytes[byteIndex] >> bitOffset) & 0b11;
            switch (genotypeBits) {
                case 0b00:
                    returnArray[i * numInds + j] = 0; break; // Homozygous reference
                case 0b10:
                    returnArray[i * numInds + j] = 1; break; // Heterozygous
                case 0b11:
                    returnArray[i * numInds + j] = 2; break; // Homozygous alternate
                case 0b01:
                    returnArray[i * numInds + j] = 3; break; // Missing genotype
            }
        }
    }
    console.log(`Loaded ${numSnps * numInds} genotypes from BED file.`);
    return returnArray;
}

export function readSnpWeights(snpWeightText) {
    const lines = snpWeightText.trim().split('\n');
    const numSNPs = lines.length;
    let snpIDs = new Array(numSNPs);
    let chromosomes = new Uint8Array(numSNPs);
    let positions = new Uint32Array(numSNPs);
    let alleles1 = new Uint8Array(numSNPs);
    let alleles2 = new Uint8Array(numSNPs);
    let firstLineFields = lines[0].trim().split(/\s+/);
    if (firstLineFields.length < 7) {
        throw new Error(`For SnpWeights expected at least 7 columns per line (snpIDs, chrom, pos, allele1, allele2, and at least one PC and one frequency), but found ${firstLineFields.length} in the first line.`);
    }
    let numPCs = firstLineFields.length - 6;
    let pcWeights = new Float32Array(numSNPs * numPCs);
    let frequencies = new Float32Array(numSNPs);
    for (let i = 0; i < numSNPs; i++) {
        const fields = lines[i].trim().split(/\s+/);
        snpIDs[i] = fields[0];
        chromosomes[i] = parseInt(fields[1]);
        if (isNaN(chromosomes[i]) || chromosomes[i] < 1 || chromosomes[i] > 25) {
            throw new Error(`Invalid chromosome for SNP ${snpIDs[i]}: ${fields[1]}`);
        }
        positions[i] = parseInt(fields[2]);
        if (isNaN(positions[i])) {
            throw new Error(`Invalid position for SNP ${snpIDs[i]}: ${fields[2]}`);
        }
        alleles1[i] = fields[3].charCodeAt(0);
        alleles2[i] = fields[4].charCodeAt(0);
        if (fields.length !== numPCs + 6) {
            throw new Error(`Inconsistent number of columns in line ${i + 1}:
                                expected ${numPCs + 6}, found ${fields.length}`);
        }
        for (let j = 0; j < numPCs; j++) {
            pcWeights[i * numPCs + j] = parseFloat(fields[5 + j]);
            if (isNaN(pcWeights[i * numPCs + j])) {
                throw new Error(`Invalid weight for SNP ${snpIDs[i]} PC${j + 1}: ${fields[5 + j]}`);
            }
        }
        frequencies[i] = parseFloat(fields[5 + numPCs]);
        if (isNaN(frequencies[i])) {
            throw new Error(`Invalid frequency for SNP ${snpIDs[i]}: ${fields[5 + numPCs]}`);
        }
    }
    console.log(`Loaded ${numSNPs} SNPs with ${numPCs} PCs from weight file.`);
    return { snpIDs, chromosomes, positions, alleles1, alleles2, pcWeights, frequencies, numSNPs, numPCs };
}

export function getOverlapMasks(plinkBimData, snpWeights) {
    let snpWeightMask = new Uint8Array(snpWeights.snpIDs.length);
    let plinkMask = new Uint8Array(plinkBimData.snpIDs.length);
    let flipMask = new Uint8Array(plinkBimData.snpIDs.length);
    let plinkIndex = 0;
    let removedStrandAmbiguous = 0;
    let removedInconsistent = 0;
    let nrIncluded = 0;
    let nrToBeFlipped = 0;

    for (let i = 0; i < snpWeights.snpIDs.length; i++) {
        while (plinkBimData.chromosomes[plinkIndex] < snpWeights.chromosomes[i] ||
                (plinkBimData.chromosomes[plinkIndex] == snpWeights.chromosomes[i] &&
                plinkBimData.positions[plinkIndex] < snpWeights.positions[i])) {
            plinkIndex++;
        }
        if (plinkBimData.chromosomes[plinkIndex] === snpWeights.chromosomes[i] &&
            plinkBimData.positions[plinkIndex] === snpWeights.positions[i]) {
            const pa1 = String.fromCharCode(plinkBimData.alleles1[plinkIndex]);
            const pa2 = String.fromCharCode(plinkBimData.alleles2[plinkIndex]);
            const sa1 = String.fromCharCode(snpWeights.alleles1[i]);
            const sa2 = String.fromCharCode(snpWeights.alleles2[i]);
            if (!strandAmbiguous(sa1, sa2)) {
                if (isConsistent(sa1, pa1) && isConsistent(sa2, pa2) ||
                    isConsistent(sa1, complement(pa1)) && isConsistent(sa2, complement(pa2))) {
                    snpWeightMask[i] = 1;
                    plinkMask[plinkIndex] = 1;
                    nrIncluded++;
                } else if (isConsistent(sa1, pa2) && isConsistent(sa2, pa1) ||
                            isConsistent(sa1, complement(pa2)) && isConsistent(sa2, complement(pa1))) {
                    snpWeightMask[i] = 1;
                    plinkMask[plinkIndex] = 1;
                    flipMask[plinkIndex] = 1;
                    nrIncluded++;
                    nrToBeFlipped++;
                } else {
                    removedInconsistent++;
                }
            }
            else {
                removedStrandAmbiguous++;
            }
        }
        if(plinkIndex >= plinkBimData.snpIDs.length) {
            break;
        }
    }
    return { snpWeightMask, plinkMask, flipMask, removedStrandAmbiguous,
                removedInconsistent, nrIncluded, nrToBeFlipped };
}

function strandAmbiguous(a1, a2) {
    // Bug 1 fix: returns true when the pair IS ambiguous (A/T or C/G), false otherwise
    return (a1 + a2 === 'AT' ||
            a1 + a2 === 'TA' ||
            a1 + a2 === 'CG' ||
            a1 + a2 === 'GC');
}

function isConsistent(a1, a2) {
    return (  a1 === a2
//           || (a1 !== 'N' && a2 === 'N')
//           || (a1 === 'N' && a2 !== 'N')
            );
}

function complement(a) {
    switch (a) {
        case 'A':
            return 'T';
        case 'T':
            return 'A';
        case 'C':
            return 'G';
        case 'G':
            return 'C';
        default:
            return a; // Return the same character for non-ACGT bases
    }
}

export function reducePcWeights(snpWeights, overlap) {
    if (snpWeights.numSNPs == overlap.nrIncluded) {
    return {pcWeights: snpWeights.pcWeights,
            frequencies: snpWeights.frequencies};
    } else {
    let reducedIndex = 0;
    const pcWeights = new Float32Array(overlap.nrIncluded * snpWeights.numPCs);
    const frequencies = new Float32Array(overlap.nrIncluded);
    for(let i = 0; i < snpWeights.numSNPs; i++) {
        if(overlap.snpWeightMask[i]) {
        for(let j = 0; j < snpWeights.numPCs; j++)
            pcWeights[reducedIndex * snpWeights.numPCs + j] = snpWeights.pcWeights[i * snpWeights.numPCs + j];
        frequencies[reducedIndex] = snpWeights.frequencies[i];
        reducedIndex++;
        }
    }
    return {pcWeights, frequencies};
    }
}

export function extractAndTransposeGenotypes(plinkBedDat, numSNPs, numInds, overlap) {
    const newGenotypeMatrix = new Uint8Array(numInds * overlap.nrIncluded); // we transpose the output
    let reducedIndex = 0;
    for(let i = 0; i < numSNPs; i++) {
    if(overlap.plinkMask[i]) {
        for(let j = 0; j < numInds; j++) {
        const srcGeno = plinkBedDat[i * numInds + j];
        const targetGeno = overlap.flipMask[i] ? flip(srcGeno) : srcGeno;
        newGenotypeMatrix[j * overlap.nrIncluded + reducedIndex] = targetGeno; //transpose
        }
        reducedIndex++;
    }
    }
    return newGenotypeMatrix;
}

function flip(geno) {
    if(geno == 3) // missing
    return 3;
    else
    return 2 - geno;
}

export function projectSamples(
        genotypeMatrix,
        pcWeights,
        frequencies,
        numInds,
        numPCs,
        yScale,
        eigenValues
    ){
    let ret = [];
    const numSNPs = frequencies.length;
    const aBuf = new Float64Array(pcWeights.length);
    const bBuf = new Float64Array(numSNPs);
    for (let i = 0; i < numInds; i++) {
        let reducedIndex = 0;
        for (let j = 0; j < numSNPs; j++) {
            const geno = genotypeMatrix[i * numSNPs + j];
            const f = frequencies[j];
            if (geno !== 3) { // not missing
                const centeredGeno = geno - 2 * f;
                bBuf[reducedIndex] = centeredGeno / Math.sqrt(f * (1 - f));
                for (let k = 0; k < numPCs; k++) {
                    aBuf[reducedIndex * numPCs + k] =
                        pcWeights[j * numPCs + k] /
                            Math.sqrt(numSNPs * eigenValues[k] * yScale);
                }
                reducedIndex++;
            }
        }
        const nonMissing = reducedIndex;
        const M = nonMissing;
        dgels('row-major', 'no-transpose', M, numPCs, 1,
              aBuf, M, bBuf, 1, nonMissing, numPCs);
        ret[i] = {
            pcCoordinates: Array.from(
                bBuf.subarray(0, numPCs).map((x, k) =>
                    x / (yScale * eigenValues[k]))),
            nonMissingCount: nonMissing
        };
    }
    return ret;
}