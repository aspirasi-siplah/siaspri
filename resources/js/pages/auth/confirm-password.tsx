import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi Password" />

            <div className="mb-4 text-center text-sm text-muted-foreground">
                Ini adalah area aman. Silakan masukkan password Anda untuk melanjutkan.
            </div>

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoFocus
                                autoComplete="current-password"
                                placeholder="Masukkan password Anda"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center justify-end gap-4">
                            <TextLink href={logout()} className="text-sm">
                                Keluar
                            </TextLink>
                            <Button
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner />}
                                Konfirmasi
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi Password',
    description: 'Silakan masukkan password Anda untuk mengakses halaman ini.',
};
