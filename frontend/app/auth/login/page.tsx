import Input from "@/app/_components/shared/Input";
import { Text } from "@/app/_components/shared/Text";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full rounded-2xl bg-background px-6 py-4 shadow-md">
        <Image
          src={"/logo.png"}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto object-cover w-20 h-20 md:w-26 md:h-26"
        />
        <div className="flex flex-col gap-4 mt-8">
          <Text color={"primary"} font={"bold"} size={"2xl"}>
            تسجيل الدخول
          </Text>
          <Text color={"secondary"} font={"medium"} size={"sm"}>
            أهلاً بعودتك، سجّل دخولك لإدارة مواعيدك.
          </Text>
        </div>
        <form className="flex flex-col gap-4 mt-4">
          <Input
            id="email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="emad@example.com"
          />
          <Input
            id="password"
            type="password"
            label="كلمة المرور"
            placeholder="******"
          />
          <Button size={"lg"}>تسجيل الدخول</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
