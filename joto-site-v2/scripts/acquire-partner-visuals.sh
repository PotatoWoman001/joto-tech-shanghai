#!/usr/bin/env bash
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

download() {
  local slug="$1"
  local role="$2"
  local url="$3"
  local output_dir="$root_dir/src/assets/partners/$slug"
  local input_file="$tmp_dir/$slug-$role"
  local output_file="$output_dir/$role.jpg"

  mkdir -p "$output_dir"
  [[ -s "$output_file" ]] && return
  curl -fsSL --retry 2 -A "Mozilla/5.0" "$url" -o "$input_file"
  /usr/bin/sips -s format jpeg -s formatOptions 84 -Z 1600 "$input_file" \
    --out "$output_file" >/dev/null
  printf '%-24s %-12s %s\n' "$slug" "$role" "$output_file"
}

while IFS='|' read -r slug role url; do
  [[ -z "$slug" || "$slug" == \#* ]] && continue
  download "$slug" "$role" "$url"
done <<'MANIFEST'
# slug|role|official asset URL
aruba|hero|https://files.readme.io/c4861eb-aruba-developer-hub-header.jpg
aruba|planning|https://files.readme.io/270ae17-AFC_Window.png
aruba|deployment|https://files.readme.io/53c7b95-icon-dev-hub-aos-cx_300x260.png
aruba|operations|https://files.readme.io/f83f6d1-icon-dev-hub-central_300x260.png
sangfor-network|hero|https://www.sangfor.com/sites/default/files/inline-images/Secure-SD-WAN-Main-Graphic_0.png
sangfor-network|planning|https://www.sangfor.com/sites/default/files/inline-images/Sangfor-Athena.png
sangfor-network|deployment|https://www.sangfor.com/sites/default/files/2025-09/ngfw.png
sangfor-network|operations|https://www.sangfor.com/sites/default/files/2025-09/central_manager.png
knowbe4|hero|https://www.knowbe4.com/hubfs/HRM%2BSAT_Diagram_NoTextVertical_Updated_April_676h.jpg
knowbe4|planning|https://www.knowbe4.com/hubfs/1-ReduceRepeatIncidents_space_1100w.png
knowbe4|deployment|https://www.knowbe4.com/hubfs/2-ScaleProgram_1100w.png
knowbe4|operations|https://www.knowbe4.com/hubfs/3-HighRisk_1100w.png
palo-alto-networks|hero|https://www.paloaltonetworks.com/content/dam/pan/en_US/images/ngfw/maximized-roi-with-our-network-security-platform.png
palo-alto-networks|planning|https://www.paloaltonetworks.com/content/dam/pan/en_US/images/ngfw/product/miercom_ngfw-use-cases.jpeg
palo-alto-networks|deployment|https://www.paloaltonetworks.com/content/dam/pan/en_US/images/network-security/nova/06-PA_1410_FrontWtop-669x376.png
palo-alto-networks|operations|https://www.paloaltonetworks.com/content/dam/pan/en_US/images/ngfw/overview/cloud-ngfw.png
fortinet|hero|https://www.fortinet.com/content/dam/fortinet/images/diagrams/diagram-hybrid-mesh-firewall-white.png
fortinet|planning|https://www.fortinet.com/content/dam/fortinet/images/diagrams/diagram-fortimanager-cloud.png
fortinet|deployment|https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/pdf/fortigate-200g-series.pdf.thumb.319.319.png
fortinet|operations|https://www.fortinet.com/content/dam/fortinet/images/products/laptop-ui-screenshot-fortimanager-gui.png
sangfor-security|hero|https://www.sangfor.com/sites/default/files/inline-images/Sangfor-Athena.png
sangfor-security|planning|https://www.sangfor.com/sites/default/files/inline-images/Secure-SD-WAN-Main-Graphic_0.png
sangfor-security|deployment|https://www.sangfor.com/sites/default/files/2025-09/ngfw.png
sangfor-security|operations|https://img.youtube.com/vi/eGTOSY4IJF4/hqdefault.jpg
check-point|hero|https://www.checkpoint.com/wp-content/uploads/cp-platform-video.png
check-point|planning|https://www.checkpoint.com/wp-content/uploads/platform-diagram-1200x600-1.png
check-point|deployment|https://www.checkpoint.com/wp-content/uploads/19894-NGFW_tabs_modules_images-600x600_v1dp-enterprise_products.jpg
check-point|operations|https://www.checkpoint.com/wp-content/uploads/infinity-platform-600x350-1.jpg
onelogin|hero|https://www.onelogin.com/images/video/medium/onelogin-cloudbased-iam-for-the-modern-enterprise8157463-medium.jpg
onelogin|planning|https://www.onelogin.com/images/patterns/image/570-265/onelogin-workforce-identity.jpg
onelogin|deployment|https://www.onelogin.com/images/patterns/image/570-265/onelogin-customer-identity.jpg
onelogin|operations|https://www.onelogin.com/images/video/medium/onelogin-delivers-tailored-solutions-for-your-unique-business-needs-in8164070-medium.jpg
dell-technologies|hero|https://img.youtube.com/vi/0JjTZ0cIHAY/maxresdefault.jpg
dell-technologies|planning|https://img.youtube.com/vi/2VOUvDhDusE/maxresdefault.jpg
dell-technologies|deployment|https://img.youtube.com/vi/2t5h5I7evFM/maxresdefault.jpg
dell-technologies|operations|https://img.youtube.com/vi/32UX36SM2kA/maxresdefault.jpg
huawei|hero|https://e-file.huawei.com/marketingcloud/pep/asset/20000001/products/storage/storage-banner-pc_001.jpg
huawei|planning|https://e-file.huawei.com/marketingcloud/pep/asset/2000000101/images/products/storage/simplified-all-flash-data-center-en.jpg
huawei|deployment|https://e-file.huawei.com/marketingcloud/pep/asset/2000000101/images/products/storage/all-flash-storage/all-flash-storage-1-2.jpg
huawei|operations|https://e-file.huawei.com/marketingcloud/pep/asset/2000000101/images/products/storage/all-flash-storage/all-flash-storage-1-4.jpg
inspur|hero|https://en.inspur.com/uiFramework/commonResource/image/2024041109403542500.jpg
inspur|planning|https://en.inspur.com/uiFramework/commonResource/image/2024041109404236752.jpg
inspur|deployment|https://en.inspur.com/uiFramework/commonResource/image/a1s1_m11.png
inspur|operations|https://en.inspur.com/uiFramework/commonResource/image/a1s1_m13.png
audiocodes|hero|https://www.audiocodes.com/media/rn1jqtdn/session-border-controllers-sbcs-banner.png
audiocodes|planning|https://www.audiocodes.com/media/dhujhzcb/session-border-controllers-sbcs-diagram-1266.jpg
audiocodes|deployment|https://www.audiocodes.com/media/vdzbfw5n/session-border-controllers-sbcs-overview.jpg?width=918&height=747
audiocodes|operations|https://www.audiocodes.com/media/11506/management-products-and-solutions-r_1.jpg
vodia|hero|https://cdn.prod.website-files.com/65698eb840bd54b62e90e134/698603573bd86b95ab262f67_admin%20portal.png
vodia|planning|https://cdn.prod.website-files.com/65698eb840bd54b62e90e134/6986035740aa3cc17ffd073e_dashboard.png
vodia|deployment|https://cdn.prod.website-files.com/65698eb840bd54b62e90e134/66a8e7f040b7b0ff39c2a9d9_sbc%20teams.png
vodia|operations|https://cdn.prod.website-files.com/65698eb840bd54b62e90e134/698603dbfce8a02773b0b9ce_real%20time%20dashboard.png
cyberdata|hero|https://www.cyberdata.net/cdn/shop/files/GroupSIP2025_7c7bff21-8c6c-4bd4-b9ad-c7da8340285c_500x.png?v=1761970074
cyberdata|planning|https://www.cyberdata.net/cdn/shop/files/enterprises-banner-2_1800x.webp?v=1765206912
cyberdata|deployment|https://www.cyberdata.net/cdn/shop/files/keypadintercomv3noshroud-copy_780x.png?v=1613706462
cyberdata|operations|https://www.cyberdata.net/cdn/shop/files/MicrosoftTeams-image_2_-_Copy_780x.png?v=1732736906
informacast|hero|https://www.singlewire.com/wp-content/uploads/informacast-header-2140.png
informacast|planning|https://www.singlewire.com/wp-content/uploads/technology-integrations-600.jpg
informacast|deployment|https://www.singlewire.com/wp-content/uploads/InformaCast-Wearable-Alert-Badge-600x600-1.jpg
informacast|operations|https://www.singlewire.com/wp-content/uploads/interactive-school-TIMG2-1.png
verkada|hero|https://cdn.verkada.com/image/upload/c_limit,w_3840/f_auto/q_auto/v1/uploads/homepage/video_security_product_image
verkada|planning|https://cdn.verkada.com/image/upload/c_limit,w_1920/f_auto/q_auto/v1/img/homepage/access_control_product_image_2026
verkada|deployment|https://cdn.verkada.com/image/upload/c_limit,w_3840/f_auto/q_auto/v1/uploads/homepage/air_quality_sensors_product_image
verkada|operations|https://cdn.verkada.com/image/upload/c_limit,w_3840/f_auto/q_auto/v1/uploads/homepage/workplace_product_image
hikvision|hero|https://img.youtube.com/vi/yJ9okURWUOQ/maxresdefault.jpg
hikvision|planning|https://img.youtube.com/vi/0xkXsV6BPNQ/maxresdefault.jpg
hikvision|deployment|https://img.youtube.com/vi/-_vsv68iyYs/maxresdefault.jpg
hikvision|operations|https://img.youtube.com/vi/aSNnTvdwrK4/maxresdefault.jpg
keyking|hero|https://www.keyking.net/img/home-pro01.png
keyking|planning|https://www.keyking.net/filebag/201702082211678359.jpg
keyking|deployment|https://www.keyking.net/img/home-pro07.png
keyking|operations|https://www.keyking.net/img/home-pro06.png
MANIFEST
