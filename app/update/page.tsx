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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  nameId: z.string(),
  file: z.instanceof(FileList),
});

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const user = useUserStore((state) => state.user);

  const [preview, setPreview] = useState("/tree.jpg");
  const [selectedFile, setSelectedFile] = useState<Blob>();
  const [userTrees, setUserTrees] = useState<RecordModel[]>();

  const fileRef = form.register("file");

  useEffect(() => {
    (async () => {
      console.log(user.id);
      const retrievedData = await pb.collection("trees").getFullList({
        filter: `user_id="${user.id}"`,
      });

      setUserTrees(retrievedData);
    })();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("picUrl", selectedFile);
      formData.append("tree_id", data.nameId);
      const createdRecordTreeImages = await pb
        .collection("tree_images")
        .create(formData);
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-full gap-2 px-4 pt-10">
        <div className="relative size-64">
          <Image
            src={preview}
            alt="its a pic"
            fill
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full p-10 flex flex-col gap-10"
          >
            <div className="flex flex-col gap-5 w-full">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Upload Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...fileRef}
                          onChange={(e) => {
                            if (e.target.files) {
                              const previewUrl = URL.createObjectURL(
                                e.target.files[0]
                              );
                              setSelectedFile(e.target.files[0]);
                              setPreview(previewUrl);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Share the picture of your awesome tree!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

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
