"use client";
import { signInFn } from "@/app/services/auth/signin";
import { Checkbox } from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { enqueueSnackbar as Snackbar } from "notistack";
import { useMutation } from "react-query";

export default function SignIn() {
  const router = useRouter();
  const { mutate: signIn } = useMutation(signInFn, {
    onSuccess: (res) => {
      Snackbar(res.message, { variant: "success" });
      localStorage.setItem("token", res.token);
      router.push("/");
    },
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      signIn(values);
    },
  });

  return (
    <>
      <div className="p-4 py-6 text-white bg-blue-500 md:w-1/2 md:flex-shrink-0 md:flex md:flex-col md:items-center md:justify-evenly">
        <div className="my-3 text-4xl font-bold tracking-wider text-center">
          <a href="#">Desi Chat</a>
        </div>
        <p className="px-10 mt-6 font-normal text-center text-gray-200 md:mt-0">
          Discover Desi Chat - your lively online hub celebrating the essence of
          South Asian culture! Engage, connect, and explore a vibrant community
          passionate about Bollywood, delicious cuisines, and cultural
          diversity. Join us now to connect with fellow enthusiasts and dive
          into the heart of Desi heritage!
        </p>
        <p className="flex flex-col items-center justify-center mt-10 text-center">
          <span>Dont have an account?</span>
          <Link href="/auth/signup" className="underline">
            Get Started!
          </Link>
        </p>
        <p className="mt-6 text-sm text-center text-gray-300">
          Read our{" "}
          <a href="#" className="underline">
            terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            conditions
          </a>
        </p>
      </div>
      <form onSubmit={formik.handleSubmit} className="bg-white p-9 md:flex-1">
        <div className="flex flex-col my-4 text-center text-gray-700">
          <p className="text-4xl font-bold">Login Account</p>
          <p className="text-xs">Login your account to get started.</p>
        </div>

        <div className="flex flex-col space-y-5">
          <div className="flex flex-col space-y-1">
            <label for="email" className="text-sm font-semibold text-gray-500">
              Email address
            </label>
            <input
              type="email"
              name="email"
              className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <label
                for="password"
                className="text-sm font-semibold text-gray-500"
              >
                Password
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline focus:text-blue-800"
              >
                Forgot Password?
              </a>
            </div>
            <input
              type="password"
              name="password"
              className="px-4 py-2 transition duration-300 border border-gray-300 rounded focus:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-200"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </div>
          <div className="flex items-center">
            <Checkbox />
            <p className="pb-1 text-sm font-semibold text-gray-500">
              Remember me
            </p>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-lg font-semibold text-white transition-colors duration-300 bg-blue-500 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-blue-200 focus:ring-4"
            >
              Sign in
            </button>
          </div>
          <div className="flex flex-col space-y-5">
            <span className="flex items-center justify-center space-x-2">
              <span className="h-px bg-gray-400 w-14"></span>
              <span className="font-normal text-gray-500">or start with</span>
              <span className="h-px bg-gray-400 w-14"></span>
            </span>
            <div className="flex flex-col space-y-4">
              <a
                href="#"
                className="flex items-center justify-center px-4 py-2 space-x-2 transition-colors duration-300 border border-gray-800 rounded-md group hover:bg-gradient-to-r from-blue-500 via-green-400 to-red-500 focus:outline-none"
              >
                <span>
                  <Image alt="" src="/google.svg" height={20} width={20} />
                </span>
                <span className="text-sm font-medium text-gray-800 group-hover:text-white">
                  Google
                </span>
              </a>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
