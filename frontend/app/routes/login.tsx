

import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "src/store/store";
import { updateForm, loginStart, loginSuccess, loginFailure, setFormErrors } from "src/store/authSlice";
import { useNavigate } from "react-router";
import { validateLoginForm } from "src/utils/validation";
import { Button, Input } from "~/components/ui";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, isLoading, error, formErrors } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateLoginForm(form);
    if (Object.keys(errors).length > 0) {
      dispatch(setFormErrors(errors));
      return;
    }

    dispatch(loginStart());

    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic
      const role = form.username === "admin" ? "admin" : "user";
      
      if (form.username === "admin" && form.password === "admin123") {
        dispatch(loginSuccess({ role }));
        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      } else if (form.username === "user" && form.password === "user123") {
        dispatch(loginSuccess({ role }));
        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      } else {
        dispatch(loginFailure("Invalid username or password"));
      }
    } catch (error) {
      dispatch(loginFailure("Login failed. Please try again."));
    }
  };

  return (
    <main className="flex flex-col lg:flex-row justify-start items-center w-full min-h-screen bg-[#ffffff]">
      
      {/* Left Column - Login Form */}
      <section className="flex flex-col justify-start items-end w-full lg:w-[42%] px-[28px] sm:px-[42px] lg:px-[56px] pr-[94px] py-8 lg:py-0">
        <div className="flex flex-col gap-[18px] sm:gap-[27px] lg:gap-[36px] justify-start items-center w-full max-w-[364px]">

          <h1 className="text-[24px] sm:text-[27px] lg:text-[30px] font-normal leading-[29px] sm:leading-[32px] lg:leading-[36px] text-left uppercase text-[#000000] w-auto">
            Login
          </h1>

          <p className="text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[16px] sm:leading-[17px] lg:leading-[19px] text-left text-[#6b7280] w-auto text-center">
            Welcome back, please login to continue
          </p>

          {/* Error Message */}
          {error && (
            <div className="w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Username Input */}
          <Input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => dispatch(updateForm({ field: "username", value: e.target.value }))}
            disabled={isLoading}
            error={formErrors.username}
            icon={<img src="/images/img_frame.svg" className="w-[24px] h-[24px]" alt="User icon" />}
          />

          {/* Password Input */}
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => dispatch(updateForm({ field: "password", value: e.target.value }))}
            disabled={isLoading}
            error={formErrors.password}
            icon={<img src="/images/img_frame_gray_900.svg" className="w-[24px] h-[24px]" alt="Password icon" />}
            className="bg-[#e8ffd7]"
          />

          {/* Login Button */}
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            size="md"
            className="w-auto"
          >
            Login Now
          </Button>

          {/* Google Login */}
          <Button
            variant="secondary"
            size="md"
            className="w-full relative"
            disabled={isLoading}
          >
            <img src="/images/img_google_1.png" className="absolute left-[21px] w-[30px] h-[30px]" alt="Google logo" />
            <span className="text-[12px] font-normal leading-[18px] text-left text-[#1c1c1c]">
              Login with <span className="font-bold">Google</span>
            </span>
          </Button>

          {/* Register Link */}
          <div className="flex flex-row justify-end items-center w-auto gap-2">
            <span className="text-[13px] font-normal leading-[16px] text-left text-[#000000]">New user?</span>
            <a href="/register" className="text-[13px] font-normal leading-[20px] text-left text-[#001bb7] shadow-[0px_4px_4px_#0000003f] hover:text-[#0015a3] transition-colors duration-300">
              Register now
            </a>
          </div>
        </div>
      </section>

      {/* Right Column - Image/Promo */}
      {/* <section className="flex flex-col justify-start items-end w-full lg:w-[58%] min-h-[400px] lg:min-h-screen">
        <div className="flex flex-col justify-center items-center w-full lg:w-[88%] h-full bg-[url('/images/img_rectangle_4.png')] bg-cover bg-center relative rounded-[46px]">
          
          <div className="relative w-[280px] sm:w-[400px] lg:w-[522px] h-[400px] sm:h-[500px] lg:h-[576px] mb-[14px]">
            <div className="absolute inset-0 w-[270px] sm:w-[390px] lg:w-[510px] h-[400px] sm:h-[500px] lg:h-[576px] bg-[#ffffff35] border-[1px] border-solid border-[#ffffff84] rounded-[46px] shadow-[0px_4px_13px_#888888ff] z-0"></div>
            <h2 className="absolute top-[39px] sm:top-[58px] lg:top-[78px] left-[17px] sm:left-[25px] lg:left-[35px] text-[45px] sm:text-[60px] lg:text-[75px] font-semibold leading-[60px] sm:leading-[80px] lg:leading-[100px] text-[#ffffff] w-[92%]">
              Inventory Dashboard Access
            </h2>
            <p className="absolute bottom-[47px] sm:bottom-[70px] lg:bottom-[94px] left-[17px] sm:left-[25px] lg:left-[34px] text-[20px] sm:text-[26px] lg:text-[32px] font-normal leading-[24px] sm:leading-[30px] lg:leading-[38px] text-[#1c1c1c]">
              Optimized Order Tracking Flow
            </p>
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
            Inventory Dashboard Access
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
