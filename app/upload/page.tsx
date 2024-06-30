"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { pb } from "@/lib/pbClient";
import { useUserStore } from "@/lib/stores/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Webcam from "react-webcam";
import { useActiveAccount, useAutoConnect } from "thirdweb/react";
import { safeMint } from "@/thirdweb/43113/0xdcee2dd10dd46086cc1d2b0825a11ffc990e6eff";
import { nftreeContract } from "@/lib/web3";
import { client } from "@/lib/thirdWebClient";
import { Wallet, createWallet, inAppWallet } from "thirdweb/wallets";
import { sendAndConfirmTransaction } from "thirdweb";

// Utility function to convert data URL to Blob
const dataURLToBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Define the form schema with location fields
const formSchema = z.object({
  description: z.string().min(1).max(100),
  type: z.string(),
  name: z.string(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user", // Initial facing mode is the front camera
};

const treeUUID = crypto.randomUUID();
let wallet: Wallet;

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [isCaptureEnabled, setCaptureEnabled] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string>("/tree.jpg");
  const [selectedFile, setSelectedFile] = useState<Blob>();
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  console.log(`lat:${latitude}, long: ${longitude}`);

  // Function to capture image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
      const imageBlob = dataURLToBlob(imageSrc);
      setSelectedFile(imageBlob);
    }
  }, [webcamRef]);

  // Function to toggle camera facing mode
  const toggleCamera = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  // Function to get the user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("pos:", position);

        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Function to start capturing and get the location
  const startCaptureWithLocation = () => {
    setCaptureEnabled(true);
    getLocation();
  };

  const user = useUserStore((state) => state.user);

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
      // console.log(Array.from(formData));
      if (!activeAccount) throw "Account not active";

      const reciept = await sendAndConfirmTransaction({
        transaction: safeMint({
          to: user.walletAddress,
          uri: `${process.env.NEXT_PUBLIC_BASE_URL}/trees/${treeUUID}`,
          contract: nftreeContract,
        }),
        account: activeAccount,
      });

      const trees = await pb.collection("trees").getFullList({
        sort: "-tokenId",
      });

      const id: string = trees.length === 0 ? "-1" : trees[0].tokenId;

      // const createdRecordPosts = await pb.collection("posts").create(formData);
      const createdRecordTrees = await pb.collection("trees").create({
        location: `${latitude}, ${longitude}`, // Using the captured location
        user_id: user.id,
        type: data.type,
        name: data.name,
        tree_uuid: treeUUID,
        tokenId: parseInt(id) + 1,
      });

      const newFormData = new FormData();
      newFormData.append("picUrl", selectedFile);
      newFormData.append("tree_id", createdRecordTrees.id);
      newFormData.append("user_id", user.id);
      newFormData.append("upvotes", "0");
      const createdRecordTreeImages = await pb
        .collection("tree_images")
        .create(newFormData);

      // TODO: redirect to individual tree page
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-full gap-2 px-4 pt-10">
        {/* Image preview */}
        <div className="relative size-64">
          <Image
            src={url}
            alt="Preview of the captured image"
            fill
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        {/* Form */}
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
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setCaptureEnabled(false);
                        }}
                      >
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
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          capture();
                        }}
                      >
                        Capture
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleCamera();
                        }}
                      >
                        Switch Camera
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button onClick={startCaptureWithLocation}>Start</Button>
                )}
              </div>

              {/* Form Fields */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Name your tree (important!)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      What kind of tree did you plant?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell everyone about your newly planted tree!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Submit new tree</Button>
            {/* <TransactionButton
              transaction={() =>
                safeMint({
                  to: user.walletAddress,
                  uri: `${process.env.NEXT_PUBLIC_BASE_URL}/trees/${treeUUID}`,
                  contract: nftreeContract,
                })
              }
              onTransactionConfirmed={() => {
                form.handleSubmit(onSubmit);
              }}
              onError={(e) => {
                alert(e);
              }}
              disabled={false}
            >
              Confirm Transaction
            </TransactionButton> */}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
