import { Text, View } from "react-native";
import { Button } from "@workspace/rn-ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/src/api/client";

export default function HomeScreen() {
    const { data, error } = useQuery(
        trpc.hello.queryOptions({ text: "Ritesh" })
    );

    return (
        <View className="flex-1 items-center justify-center">
            <Button variant={"destructive"}>
                <Text>Hello</Text>
            </Button>
            <Text className="bg-red-400">
                Test without rn-ui:{" "}
                {data?.greeting ?? error?.message ?? "Loading..."}
            </Text>
        </View>
    );
}
