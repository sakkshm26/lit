-- DropForeignKey
ALTER TABLE "institute" DROP CONSTRAINT "institute_city_id_fkey";

-- AlterTable
ALTER TABLE "institute" ADD COLUMN     "requested_by_user" BOOLEAN,
ALTER COLUMN "city_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "fcm_token" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "institute" ADD CONSTRAINT "institute_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE SET NULL ON UPDATE CASCADE;
