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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pb } from "@/lib/pbClient";
import { useUserStore } from "@/lib/stores/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { RecordModel } from "pocketbase";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Webcam from "react-webcam";

const formSchema = z.object({
  nameId: z.string().nonempty("Please select a tree"),
  file: z.instanceof(FileList).optional(),
});

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

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const user = useUserStore((state) => state.user);
  const [isCaptureEnabled, setCaptureEnabled] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string>("/tree.jpg");
  const [selectedFile, setSelectedFile] = useState<Blob>();
  const [userTrees, setUserTrees] = useState<RecordModel[]>();

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

  useEffect(() => {
    const fetchData = async () => {
      console.log(user.id);
      const retrievedData = await pb.collection("trees").getFullList({
        filter: `user_id="${user.id}"`,
      });
      setUserTrees(retrievedData);
    };
    fetchData();
  }, [user.id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("picUrl", selectedFile);
      formData.append("tree_id", data.nameId);
      await pb.collection("tree_images").create(formData);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-full gap-2 px-4 pt-10">
        <div className="relative size-64">
          <Image
            src={url}
            alt="Captured image"
            fill
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
                  <Button
                    onClick={startCaptureWithLocation}
                    className="mx-2 text-xs"
                  >
                    Start
                  </Button>
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

            <Button type="submit">Add image for tree</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
