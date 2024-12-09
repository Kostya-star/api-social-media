import { IExtendedLikesInfoView, ILikeBaseView, ILikeDB } from '@/types/likes/like';
import { IPostDB, IPostView } from '@/types/posts/post';

interface IPostDBWIthExtendedLikesInfo extends IPostDB, IExtendedLikesInfoView<ILikeDB> {}

export function postObjMapper(post: IPostDBWIthExtendedLikesInfo): IPostView {
  return {
    id: post._id,
    title: post.title,
    content: post.content,
    shortDescription: post.shortDescription,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    extendedLikesInfo: {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: post.extendedLikesInfo.myStatus,
      newestLikes: post.extendedLikesInfo.newestLikes.map((like) => ({
        addedAt: like.updatedAt,
        userId: like.userId,
        login: like.userLogin,
      })),
    },
  };
}
