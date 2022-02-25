import { UserDTO } from "./user";

export type CommentDTO = {
  id: string;
  playId: string;
  comment: string;
  createdOn: string;
  userId: string;
};

export class Comment {
  constructor(comment: CommentDTO, users: UserDTO[]) {
    this.comment = comment.comment;
    this.createdOn = new Date(comment.createdOn);
    this.id = comment.id;
    this.playId = comment.playId;
    this.userId = comment.userId;

    const user = users.find((x) => x.id === this.userId);
    if (user) {
      this.userDisplayName = user.displayName;
      this.userPhotoURL = user.photoURL;
    } else {
      this.userPhotoURL = null;
      this.userDisplayName = "Unknown user";
    }
  }

  public id: string;
  public playId: string;
  public comment: string;
  public createdOn: Date;
  public userId: string;
  public userPhotoURL?: string | null;
  public userDisplayName?: string;
}
