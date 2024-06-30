"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/lib/stores/user";
import Image from "next/image";
import { pb } from "@/lib/pbClient";
import Webcam from "react-webcam";
import { RecordModel } from "pocketbase";
import { useActiveAccount, useAutoConnect } from "thirdweb/react";
import { client } from "@/lib/thirdWebClient";
import { Wallet, createWallet, inAppWallet } from "thirdweb/wallets";
import { sendAndConfirmTransaction } from "thirdweb";
import {
  safeMint,
  verifyDaily,
} from "@/thirdweb/43113/0xdcee2dd10dd46086cc1d2b0825a11ffc990e6eff";
import { nftreeContract } from "@/lib/web3";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nameId: z.string().nonempty("Please select a tree"),
  file: z.instanceof(FileList).optional(),
});

const dataURLToBlob = (dataURL: string): Blob => {
  const [header, base64] = dataURL.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "";
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

let wallet: Wallet;

function UpdateForm({ userTrees }: { userTrees: RecordModel[] }) {
  const user = useUserStore((state) => state.user);
  const [isCaptureEnabled, setCaptureEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState("/tree.jpg");
  const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      const imageBlob = dataURLToBlob(imageSrc);
      setSelectedFile(imageBlob);
    }
  }, []);

  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const startCaptureWithLocation = () => {
    setCaptureEnabled(true);
  };

  const { data: autoConnected, isLoading } = useAutoConnect({
    client: client,
    onConnect: (w: Wallet) => {
      wallet = w;
    },
    wallets: [
      inAppWallet(),
      createWallet("app.core"),
      createWallet("io.metamask"),
    ],
  });

  const activeAccount = useActiveAccount();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (selectedFile) {
      setSubmitted(true);
      if (!activeAccount) throw "Account not active";

      const tokenId = (await pb.collection("trees").getOne(data.nameId))
        .tokenId as number;

      const reciept = await sendAndConfirmTransaction({
        transaction: verifyDaily({
          tokenId: BigInt(tokenId),
          contract: nftreeContract,
        }),
        account: activeAccount,
      });

      console.log(reciept);

      const formData = new FormData();
      formData.append("picUrl", selectedFile);
      formData.append("tree_id", data.nameId);
      formData.append("user_id", user.id);

      try {
        await pb.collection("tree_images").create(formData);
        console.log("Image added successfully");
      } catch (error) {
        console.error("Failed to add image:", error);
      }

      router.push("/")
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-full gap-2 px-4 pt-10">
        <div className="relative w-64 h-64">
          <Image
            src={url}
            alt="Captured image"
            layout="fill"
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full p-10 flex flex-col gap-10"
          >
            <div className="flex flex-col gap-5 w-full">
              {/* Capture Picture Section */}
              <div>
                <FormLabel>Capture Picture</FormLabel>
                {isCaptureEnabled ? (
                  <>
                    <div className="mb-2">
                      <Button onClick={() => setCaptureEnabled(false)}>
                        End
                      </Button>
                    </div>
                    <div className="mb-2">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ ...videoConstraints, facingMode }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={capture}>Capture</Button>
                      <Button onClick={toggleCamera}>Switch Camera</Button>
                    </div>
                  </>
                ) : (
                  <Button onClick={startCaptureWithLocation}>Start</Button>
                )}
              </div>

              <FormField
                control={form.control}
                name="nameId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Which tree do you wish to update?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select one of your trees" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {userTrees?.map((tree) => (
                          <SelectItem key={tree.id} value={tree.id}>
                            {tree.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {submitted ? (
              <>
                <Button disabled>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    viewBox="0 0 24 24"
                  >
                    <defs>
                      <filter id="svgSpinnersGooeyBalls10">
                        <feGaussianBlur
                          in="SourceGraphic"
                          result="y"
                          stdDeviation="1.5"
                        ></feGaussianBlur>
                        <feColorMatrix
                          in="y"
                          result="z"
                          values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
                        ></feColorMatrix>
                        <feBlend in="SourceGraphic" in2="z"></feBlend>
                      </filter>
                    </defs>
                    <g
                      fill="currentColor"
                      filter="url(#svgSpinnersGooeyBalls10)"
                    >
                      <circle cx="4" cy="12" r="3">
                        <animate
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.75s"
                          keySplines=".56,.52,.17,.98;.56,.52,.17,.98"
                          repeatCount="indefinite"
                          values="4;9;4"
                        ></animate>
                        <animate
                          attributeName="r"
                          calcMode="spline"
                          dur="0.75s"
                          keySplines=".56,.52,.17,.98;.56,.52,.17,.98"
                          repeatCount="indefinite"
                          values="3;8;3"
                        ></animate>
                      </circle>
                      <circle cx="15" cy="12" r="8">
                        <animate
                          attributeName="cx"
                          calcMode="spline"
                          dur="0.75s"
                          keySplines=".56,.52,.17,.98;.56,.52,.17,.98"
                          repeatCount="indefinite"
                          values="15;20;15"
                        ></animate>
                        <animate
                          attributeName="r"
                          calcMode="spline"
                          dur="0.75s"
                          keySplines=".56,.52,.17,.98;.56,.52,.17,.98"
                          repeatCount="indefinite"
                          values="8;3;8"
                        ></animate>
                      </circle>
                    </g>
                  </svg>
                </Button>
              </>
            ) : (
              <Button type="submit">Add image for tree</Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default UpdateForm;
