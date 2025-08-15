import { Suspense } from "react";
import Loading from "@/shared/components/commons/loading/loading";
import FormLogin from "./components/form-login";


const Page = () => {
  return(
    <Suspense fallback={<Loading />}>
      {/* <LoginPage /> */}
      <FormLogin />
    </Suspense>
  );
};

export default Page;