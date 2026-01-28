import { useQueryStates } from "nuqs";
import { offeringParams } from "../params";

export const useOfferingParams = () => {
    return useQueryStates(offeringParams);
};
