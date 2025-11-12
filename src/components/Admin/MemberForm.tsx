import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MemberFormValues, Position, ThrowBat } from "@/types/member";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Select } from "../ui/select";
import { resizeImage } from "@/lib/image";

const memberSchema = z.object({
  id: z.string().optional(),
  number: z.coerce.number().min(0).max(99),
  name: z.string().min(1).max(30),
  position: z.array(z.enum(["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"])).min(1),
  throwBat: z.enum(["右投右打", "右投左打", "左投左打", "左投右打"]),
  height: z
    .preprocess((value) => (value === "" || value === null ? undefined : Number(value)), z.number().optional())
    .optional(),
  weight: z
    .preprocess((value) => (value === "" || value === null ? undefined : Number(value)), z.number().optional())
    .optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  isCaptain: z.boolean().optional(),
  isCoach: z.boolean().optional(),
  order: z.number().optional()
});

const positions: Position[] = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"];
const throwBats: ThrowBat[] = ["右投右打", "右投左打", "左投左打", "左投右打"];

interface MemberFormProps {
  defaultValues?: MemberFormValues;
  onSubmit: (values: MemberFormValues) => void;
}

export const MemberForm = ({ defaultValues, onSubmit }: MemberFormProps) => {
  const [preview, setPreview] = useState<string | undefined>(defaultValues?.photoUrl);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      position: ["P"],
      throwBat: "右投右打",
      ...defaultValues
    }
  });

  const selectedPositions = watch("position");

  useEffect(() => {
    setPreview(defaultValues?.photoUrl);
  }, [defaultValues]);

  useEffect(() => {
    register("position");
  }, [register]);

  const handleImageUpload = async (file: File) => {
    if (file.size > 1.5 * 1024 * 1024) {
      alert("画像サイズは1.5MB以下にしてください。");
      return;
    }
    const { dataUrl } = await resizeImage(file, { maxWidth: 800 });
    setValue("photoUrl", dataUrl, { shouldValidate: true });
    setPreview(dataUrl);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium text-canaria-dark">背番号</label>
        <Input type="number" {...register("number")}
          placeholder="10"
        />
        {errors.number && <p className="text-xs text-red-500">{errors.number.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-canaria-dark">氏名</label>
        <Input placeholder="山田 太郎" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-canaria-dark">ポジション</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {positions.map((pos) => (
            <label key={pos} className="flex items-center gap-2 rounded-lg border border-slate-200 p-2">
              <Checkbox
                checked={selectedPositions.includes(pos)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...selectedPositions, pos]
                    : selectedPositions.filter((value) => value !== pos);
                  setValue("position", next as Position[], { shouldValidate: true });
                }}
              />
              <span className="text-sm">{pos}</span>
            </label>
          ))}
        </div>
        {errors.position && <p className="text-xs text-red-500">1つ以上選択してください。</p>}
      </div>
      <div>
        <label className="text-sm font-medium text-canaria-dark">投/打</label>
        <Select {...register("throwBat")}>
          {throwBats.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-canaria-dark">身長 (cm)</label>
          <Input type="number" placeholder="178" {...register("height")} />
        </div>
        <div>
          <label className="text-sm font-medium text-canaria-dark">体重 (kg)</label>
          <Input type="number" placeholder="75" {...register("weight")} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-canaria-dark">紹介文</label>
        <Textarea rows={4} placeholder="チームを引っ張るムードメーカー..." {...register("bio")} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-canaria-dark">写真</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void handleImageUpload(file);
            }
          }}
        />
        {preview && <img src={preview} alt="プレビュー" className="h-32 w-32 rounded-xl object-cover" />}
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-canaria-dark">
          <Checkbox
            checked={watch("isCaptain") ?? false}
            onCheckedChange={(checked) => setValue("isCaptain", Boolean(checked))}
          />
          主将
        </label>
        <label className="flex items-center gap-2 text-sm text-canaria-dark">
          <Checkbox
            checked={watch("isCoach") ?? false}
            onCheckedChange={(checked) => setValue("isCoach", Boolean(checked))}
          />
          監督/コーチ
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
};
