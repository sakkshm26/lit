-- DropForeignKey
ALTER TABLE "vote" DROP CONSTRAINT "vote_created_for_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "allow_contact_invites" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "vote" ADD COLUMN     "revealed" BOOLEAN DEFAULT false,
ADD COLUMN     "viewed" BOOLEAN DEFAULT false,
ALTER COLUMN "created_for_user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "reveal" (
    "id" TEXT NOT NULL,
    "remaining_hints" INTEGER NOT NULL DEFAULT 3,
    "last_updated_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reveal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reveal" ADD CONSTRAINT "reveal_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_created_for_user_id_fkey" FOREIGN KEY ("created_for_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
