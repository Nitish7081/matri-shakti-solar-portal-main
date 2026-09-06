/**
 * Solar Product Model
 * Extends and aliases SolarPackage for consistent nomenclature across the codebase.
 */
import {
  SolarPackageModel,
  ISolarPackage,
} from "./SolarPackage";

export type ISolarProduct = ISolarPackage;
export const SolarProductModel = SolarPackageModel;
