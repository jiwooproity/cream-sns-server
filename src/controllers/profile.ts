import { Request, Response } from "express";

import * as service from "@/services";

import * as Types from "@/types/profile";

import { deleteInCloudinary, uploadToCloudinary } from "@/upload/cloudinary";

export async function getProfile(req: Request<Types.GetProfileParams>, res: Response) {
  const myId = req.session.user?.id;
  const userId = req.params.userId;

  try {
    const user = await service.getProfile({ myId, userId });
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({ message: "프로필 조회에 실패하였습니다." });
  }
}

export async function editProfile(req: Request<{}, {}, Types.EditProfileParams>, res: Response) {
  const userId = req.session.user?.id;

  const { file } = req;
  const { nickname, description } = req.body;

  let image;

  if (file) {
    image = await uploadToCloudinary(file!, { folder: "cream/profile" });
  }

  try {
    const user = await service.editProfile({ userId, nickname, description, image });
    req.session.user = { id: user._id };
    res.status(200).json(req.session.user);
  } catch (e) {
    if (image?.public_id) deleteInCloudinary(image?.public_id);
    if (e instanceof Error) res.status(500).json({ message: e.message });
  }
}
