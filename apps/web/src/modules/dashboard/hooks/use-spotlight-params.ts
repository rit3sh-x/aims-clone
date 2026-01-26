import { useQueryStates } from "nuqs"
import { spotlightParams } from "../params"

export const useSpotlightParams = () => {
    return useQueryStates(spotlightParams);
}