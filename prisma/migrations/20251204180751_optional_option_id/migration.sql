-- DropForeignKey
ALTER TABLE `responses` DROP FOREIGN KEY `responses_optionId_fkey`;

-- AlterTable
ALTER TABLE `responses` MODIFY `optionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `responses` ADD CONSTRAINT `responses_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `options`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
