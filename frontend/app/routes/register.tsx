


// RegisterPage.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "src/store/store";
import { updateForm, setFormErrors } from "src/store/authSlice";
import { useNavigate } from "react-router";
import { validateRegisterForm } from "src/utils/validation";
import { Button, Input } from "~/components/ui";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, formErrors } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateRegisterForm(form);
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors(errors));
      return;
    }

    // Placeholder: assume registration success
    alert("Registered successfully!");
    navigate("/login");
  };

  return (
    <main className="flex flex-col lg:flex-row w-full min-h-screen bg-[#ffffff]">
      {/* Left Column - Form */}
      <section className="flex flex-col justify-start items-end w-full lg:w-[42%] px-[28px] sm:px-[42px] lg:px-[56px] pr-[47px] sm:pr-[70px] lg:pr-[94px] py-8 lg:py-0">
        <div className="flex flex-col gap-[18px] sm:gap-[27px] lg:gap-[36px] justify-start items-center w-full max-w-[364px]">
          <h1 className="text-[24px] sm:text-[27px] lg:text-[30px] font-normal leading-[29px] sm:leading-[32px] lg:leading-[36px] uppercase text-[#000000]">
            Register
          </h1>
          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-center text-[#6b7280]">
            Welcome, please register to continue
          </p>

          {/* Name Input */}
          <Input
            type="text"
            placeholder="Username"
            value={form.username || ""}
            onChange={(e) => dispatch(updateForm({ field: "username", value: e.target.value }))}
            error={formErrors.username}
          />

          {/* Email Input */}
          <Input
            type="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) => dispatch(updateForm({ field: "email", value: e.target.value }))}
            error={formErrors.email}
          />

          {/* Password Input */}
          <Input
            type="password"
            placeholder="Password"
            value={form.password || ""}
            onChange={(e) => dispatch(updateForm({ field: "password", value: e.target.value }))}
            error={formErrors.password}
            className="bg-[#e8ffd7]"
          />

          <Button
            type="submit"
            onClick={handleSubmit}
            size="md"
            className="w-full"
          >
            Register
          </Button>

          {/* Google Sign-up */}
          <Button
            variant="secondary"
            size="md"
            className="w-full relative"
          >
            <img src="/images/img_google_1.png" className="absolute left-[21px] w-[30px] h-[30px]" alt="Google logo" />
            <span className="text-[12px] font-normal leading-[18px] text-left text-[#1c1c1c]">
              Sign-up with <span className="font-bold">Google</span>
            </span>
          </Button>

          {/* Already User Link */}
          <div className="flex flex-row justify-end items-center w-auto gap-2">
            <span className="text-[13px] font-normal text-[#000000]">Already a user?</span>
            <button
              onClick={() => navigate("/login")}
              className="text-[13px] font-normal text-[#001bb7] shadow-[0px_4px_4px_#0000003f] hover:text-[#0015a3] transition-colors duration-300"
            >
              Login now
            </button>
          </div>
        </div>
      </section>

      {/* Right Column - Same as Login */}
      {/* <section className="flex flex-col justify-start items-end w-full lg:w-[58%] min-h-[400px] lg:min-h-screen">
        <div
          className="flex flex-col justify-start items-center w-full lg:w-[88%] h-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${imgRectangle})` }}
        >
          <div className="flex flex-col justify-center items-center w-full pt-[44px] sm:pt-[66px] lg:pt-[88px] pr-[28px] sm:pr-[42px] lg:pr-[56px] pb-[44px] sm:pb-[66px] lg:pb-[88px] pl-[28px] sm:pl-[42px] lg:pl-[56px]">
            <div className="relative w-[280px] sm:w-[400px] lg:w-[522px] h-[400px] sm:h-[500px] lg:h-[576px] mb-[14px]">
              <div className="absolute inset-0 w-[270px] sm:w-[390px] lg:w-[510px] h-[400px] sm:h-[500px] lg:h-[576px] bg-[#ffffff35] border-[1px] border-solid border-[#ffffff84] rounded-[46px] shadow-[0px_4px_13px_#888888ff] z-0"></div>
              <div className="absolute top-[39px] sm:top-[58px] lg:top-[78px] left-[17px] sm:left-[25px] lg:left-[35px] right-[17px] sm:right-[25px] lg:right-[35px] z-10">
                <h2 className="text-[45px] sm:text-[60px] lg:text-[75px] font-semibold leading-[60px] sm:leading-[80px] lg:leading-[100px] text-left text-[#ffffff] w-[92%]">
                  Join Your <br />
                  Inventory <br />
                  Hub.
                </h2>
              </div>
              <div className="absolute bottom-[47px] sm:bottom-[70px] lg:bottom-[94px] left-[17px] sm:left-[25px] lg:left-[34px] z-10">
                <p className="text-[20px] sm:text-[26px] lg:text-[32px] font-normal leading-[24px] sm:text-[30px] lg:leading-[38px] text-left text-[#1c1c1c] w-auto">
                  Optimized Order Tracking Flow
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <section className="flex flex-col justify-start items-end w-full lg:w-[58%] min-h-[400px] lg:min-h-screen">
  <div className="flex flex-col justify-start items-center w-full lg:w-[88%] h-full 
                  bg-[url('/images/img_rectangle_4.png')] bg-cover bg-center relative">
    <div className="flex flex-col justify-center items-center w-full
                    pt-[44px] sm:pt-[66px] lg:pt-[88px]
                    pr-[28px] sm:pr-[42px] lg:pr-[56px]
                    pb-[44px] sm:pb-[66px] lg:pb-[88px]
                    pl-[28px] sm:pl-[42px] lg:pl-[56px]">
      {/* Content Stack */}
      <div className="relative w-[280px] sm:w-[400px] lg:w-[522px]
                      h-[400px] sm:h-[500px] lg:h-[576px] mb-[14px]">
        {/* Background Card */}
        <div className="absolute inset-0 w-[270px] sm:w-[390px] lg:w-[510px]
                        h-[400px] sm:h-[500px] lg:h-[576px]
                        bg-[#ffffff35] border-[1px] border-solid border-[#ffffff84]
                        rounded-[46px] shadow-[0px_4px_13px_#888888ff] z-0">
        </div>

        {/* Main Heading */}
        <div className="absolute top-[39px] sm:top-[58px] lg:top-[78px]
                        left-[17px] sm:left-[25px] lg:left-[35px]
                        right-[17px] sm:right-[25px] lg:right-[35px] z-10">
          <h2 className="text-[45px] sm:text-[60px] lg:text-[75px] font-semibold
                         leading-[60px] sm:leading-[80px] lg:leading-[100px]
                         text-left text-[#ffffff] w-[92%]">
                Join Your <br />
                Inventory <br />
                Hub.
          </h2>
        </div>

        {/* Subtitle */}
        <div className="absolute bottom-[47px] sm:bottom-[70px] lg:bottom-[94px]
                        left-[17px] sm:left-[25px] lg:left-[34px] z-10">
          <p className="text-[20px] sm:text-[26px] lg:text-[32px] font-normal
                        leading-[24px] sm:leading-[30px] lg:leading-[38px]
                        text-left text-[#1c1c1c] w-auto">
            Optimized Order Tracking Flow
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
  );
}
