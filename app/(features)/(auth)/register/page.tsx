import { Suspense } from "react";
import Loading from "@/shared/components/commons/loading/loading";
import FormRegister from "./components/form-register";


const Page = () => {
  return(
    <Suspense fallback={<Loading />}>
      {/* <LoginPage /> */}
      <FormRegister />
    </Suspense>
  );
};

export default Page;