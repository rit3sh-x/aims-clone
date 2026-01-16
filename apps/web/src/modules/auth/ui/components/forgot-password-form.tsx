import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useAuthLayoutContext } from "../../context/auth-context";
import { Link } from "@tanstack/react-router";

const formSchema = z.object({
    email: z.email("Invalid email"),
});

export type ForgotPasswordFormValues = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
    onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
}

export const ForgotPasswordForm = ({ onSubmit }: ForgotPasswordFormProps) => {
    const { setIsTyping } = useAuthLayoutContext();

    const form = useForm({
        defaultValues: {
            email: "",
        },
        validators: {
            onSubmit: formSchema,
        },
        onSubmit: async ({ value }) => {
            await onSubmit(value);
        },
    });

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Forgot password?
                </h1>
                <p className="text-muted-foreground text-sm">
                    Enter your email to receive a reset link
                </p>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-6 flex flex-col items-center justify-center"
            >
                <FieldGroup>
                    <form.Field name="email">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel className="text-white">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setIsTyping(true);
                                            setTimeout(
                                                () => setIsTyping(false),
                                                600
                                            );
                                        }}
                                        placeholder="you@iitrpr.ac.in"
                                        className="text-white"
                                    />
                                    {isInvalid && (
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    )}
                                </Field>
                            );
                        }}
                    </form.Field>
                </FieldGroup>
                <form.Subscribe selector={(s) => s.canSubmit}>
                    {(canSubmit) => (
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={!canSubmit}
                            className="w-full"
                        >
                            Send reset link
                        </Button>
                    )}
                </form.Subscribe>
                <Link to="/login" className="text-sm text-muted-foreground">
                    Back to login
                </Link>
            </form>
        </div>
    );
};
