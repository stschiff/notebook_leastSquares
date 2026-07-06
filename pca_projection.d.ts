interface BimData {
    snpIDs: string[];
    chromosomes: Uint8Array;
    positions: Uint32Array;
    alleles1: Uint8Array;
    alleles2: Uint8Array;
}

interface FamData {
    indNames: string[];
    popNames: string[];
}

interface SnpWeights {
    snpIDs: string[];
    chromosomes: Uint8Array;
    positions: Uint32Array;
    alleles1: Uint8Array;
    alleles2: Uint8Array;
    pcWeights: Float32Array;
    frequencies: Float32Array;
    numSNPs: number;
    numPCs: number;
}

interface OverlapMasks {
    snpWeightMask: Uint8Array;
    plinkMask: Uint8Array;
    flipMask: Uint8Array;
    removedStrandAmbiguous: number;
    removedInconsistent: number;
    nrIncluded: number;
    nrToBeFlipped: number;
}

function readBimData(bimText : string) : BimData

function readFamData(famText : string) : FamData

function readBedData(bedArrayBuffer: ArrayBuffer, numSnps: number, numInds: number) : Uint8Array

function readSnpWeights(snpWeightText : string) : SnpWeights

function getOverlapMasks(plinkBimData: BimData, snpWeights: SnpWeights) : OverlapMasks

function reducePcWeights(snpWeights: SnpWeights, overlap: OverlapMasks) : {pcWeights: Float32Array, frequencies: Float32Array}

function extractAndTransposeGenotypes(plinkBedDat: Uint8Array, numSNPs: number, numInds: number, overlap: OverlapMasks) : Uint8Array

interface ProjectionResult {
    pcCoordinates: number[];
    nonMissingCount: number;
}

function projectSamples(
        genotypeMatrix: Uint8Array,
        pcWeights: Float32Array,
        frequencies: Float32Array,
        numInds: number,
        numPCs: number,
        yScale: number,
        eigenValues: number[]    
    ) : ProjectionResult[]