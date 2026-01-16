import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { z } from "zod";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@workspace/ui/components/field";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useAuthLayoutContext } from "../../context/auth-context";
import { Link } from "@tanstack/react-router";
import { loginwithGoogle } from "../../utils/auth-handlers";

export const formSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(8, "Minimum 8 characters"),
});

export type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
    onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
    const { setIsTyping, setPasswordExist, setShowPassword, showPassword } =
        useAuthLayoutContext();

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
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
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                    Welcome back!
                </h1>
                <p className="text-muted-foreground text-sm">
                    Please enter your details
                </p>
            </div>
            <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center my-10 gap-3 text-black bg-white"
                onClick={async () => await loginwithGoogle()}
            >
                <img src="/google.svg" alt="Google" className="h-5 w-5" />
                Continue with Google
            </Button>

            <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-muted-foreground">OR</span>
                <div className="h-px flex-1 bg-white/10" />
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
                                        className="text-white"
                                        placeholder="you@iitrpr.ac.in"
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
                    <form.Field name="password">
                        {(field) => {
                            const isInvalid =
                                field.state.meta.isTouched &&
                                !field.state.meta.isValid;

                            return (
                                <Field data-invalid={isInvalid}>
                                    <FieldLabel className="text-white">
                                        Password
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            data-lpignore="true"
                                            data-form-type="password"
                                            className="text-white"
                                            onChange={(e) => {
                                                field.handleChange(
                                                    e.target.value
                                                );
                                                setPasswordExist(
                                                    e.target.value.length > 0
                                                );
                                                setIsTyping(true);
                                                setTimeout(
                                                    () => setIsTyping(false),
                                                    600
                                                );
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((p) => !p)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="size-4" />
                                            ) : (
                                                <EyeIcon className="size-4" />
                                            )}
                                        </button>
                                    </div>
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
                            variant={"secondary"}
                            disabled={!canSubmit}
                            className="w-full"
                        >
                            Login
                        </Button>
                    )}
                </form.Subscribe>
                <Link
                    to="/reset-password"
                    className="relative text-sm text-muted-foreground transition-colors hover:text-white after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:scale-x-100"
                >
                    Forgot password?
                </Link>
            </form>
        </div>
    );
};
