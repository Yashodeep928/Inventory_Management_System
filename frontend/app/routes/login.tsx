// app/routes/login.tsx
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "src/store/store";
import {
  updateForm,
  loginStart,
  loginSuccess,
  loginFailure,
  setFormErrors,
} from "src/store/authSlice";
import { validateLoginForm } from "src/utils/validation";
import { Button, Input } from "~/components/ui";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, isLoading, error, formErrors } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const errors = validateLoginForm(form);
  if (Object.keys(errors).length > 0) {
    dispatch(setFormErrors(errors));
    return;
  }

  dispatch(loginStart());

  try {
    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Login failed");
    }

    const data = await response.json();
    console.log("✅ Login response:", data);

    // Expect { user, token } from backend
    if (!data.user || !data.token) {
      throw new Error("Invalid login response — missing user or token");
    }

    // ✅ Store both in Redux & localStorage
    dispatch(loginSuccess({ user: data.user, token: data.token }));

    // ✅ Redirect user based on role
    const role = data.user.role?.toLowerCase();
    if (role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/user", { replace: true });
    }

  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    dispatch(loginFailure(err.message));
  }
};



  return (
    <main className="flex flex-col lg:flex-row justify-start items-center w-full min-h-screen bg-[#ffffff]">
      {/* Left Column - Form */}
      <section className="flex flex-col justify-start items-end w-full lg:w-[42%] px-[28px] sm:px-[42px] lg:px-[56px] pr-[94px] py-8 lg:py-0">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[18px] sm:gap-[27px] lg:gap-[36px] justify-start items-center w-full max-w-[364px]"
        >
          <h1 className="text-[24px] sm:text-[27px] lg:text-[30px] font-normal leading-[29px] sm:leading-[32px] lg:leading-[36px] uppercase text-[#000000]">
            Login
          </h1>

          <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-center text-[#6b7280]">
            Welcome back, please login to continue
          </p>

          {error && (
            <div className="w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <Input
            type="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) =>
              dispatch(updateForm({ field: "email", value: e.target.value }))
            }
            disabled={isLoading}
            error={formErrors.email}
          />

          {/* Password Field */}
          <Input
            type="password"
            placeholder="Password"
            value={form.password || ""}
            onChange={(e) =>
              dispatch(updateForm({ field: "password", value: e.target.value }))
            }
            disabled={isLoading}
            error={formErrors.password}
          />

          <Button type="submit" isLoading={isLoading} size="md" className="w-full">
            Login Now
          </Button>

          {/* Register Link */}
          <div className="flex flex-row justify-end items-center w-auto gap-2">
            <span className="text-[13px] font-normal text-[#000000]">
              New user?
            </span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-[13px] font-normal text-[#001bb7] hover:text-[#0015a3] transition-colors duration-300"
            >
              Register now
            </button>
          </div>
        </form>
      </section>

      {/* Right Column - Background image with same design as Register */}
      <section className="flex flex-col justify-start items-end w-full lg:w-[58%] min-h-[400px] lg:min-h-screen">
        <div className="flex flex-col justify-start items-center w-full lg:w-[88%] h-full 
                  bg-[url('/images/img_rectangle_4.png')] bg-cover bg-center relative">
          <div className="flex flex-col justify-center items-center w-full
                    pt-[44px] sm:pt-[66px] lg:pt-[88px]
                    pr-[28px] sm:pr-[42px] lg:pr-[56px]
                    pb-[44px] sm:pb-[66px] lg:pb-[88px]
                    pl-[28px] sm:pl-[42px] lg:pl-[56px]">
            <div className="relative w-[280px] sm:w-[400px] lg:w-[522px]
                      h-[400px] sm:h-[500px] lg:h-[576px] mb-[14px]">
              <div className="absolute inset-0 w-[270px] sm:w-[390px] lg:w-[510px]
                        h-[400px] sm:h-[500px] lg:h-[576px]
                        bg-[#ffffff35] border-[1px] border-solid border-[#ffffff84]
                        rounded-[46px] shadow-[0px_4px_13px_#888888ff] z-0">
              </div>

              <div className="absolute top-[39px] sm:top-[58px] lg:top-[78px]
                        left-[17px] sm:left-[25px] lg:left-[35px]
                        right-[17px] sm:right-[25px] lg:right-[35px] z-10">
                <h2 className="text-[45px] sm:text-[60px] lg:text-[75px] font-semibold
                         leading-[60px] sm:leading-[80px] lg:leading-[100px]
                         text-left text-[#ffffff] w-[92%]">
                  Inventory<br /> Dashboard<br /> Access
                </h2>
              </div>

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
