export { downloadCsvFile, escapeCsvCell } from './csvExport';
export { formatLocalDatePtBr, syncPublishedProductToPublicStorage } from './dashboardUtils';
export { auth, googleProvider, loginWithGoogle, logoutFromGoogle } from './firebase';
export {
  GALLERY_MAX_TOTAL_BYTES,
  GALLERY_RECOMMENDED_PHOTO_MAX_BYTES,
  MAX_IMAGE_FILE_BYTES,
  calculateContentMediaBytes,
  compressDataUrl,
  compressGalleryToBudget,
  compressImageFileToDataUrl,
  estimateImageUrlBytes,
  formatStorageSize,
  isValidImageSource,
  type CompressOptions,
  type CompressedImageResult,
  type GalleryBudgetCompressionInput,
  type GalleryBudgetCompressionResult,
} from './mediaCompression';
export {
  ASSOCIATION_WHATSAPP_NUMBER,
  DEFAULT_SELLER_SETTINGS,
  buildWhatsAppUrl,
  canContactSeller,
  formatWhatsAppNumber,
  getArtistPhoto,
  getSellerContactSettings,
  getSellerContactTimestamps,
  recordSellerContact,
  saveSellerContactSettings,
  useSellerSettings,
  type SellerContactSettings,
} from './sellerContact';
export {
  getConfiguredSocialLinks,
  normalizeExternalUrl,
  openExternalUrl,
  type SocialLinkItem,
  type SocialNetworkId,
} from './socialLinks';
export {
  getYouTubeEmbedUrl,
  getYouTubeWatchUrl,
  parseYouTubeUrl,
  type ParsedYouTubeUrl,
} from './youtube';
