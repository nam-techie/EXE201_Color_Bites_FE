import type { ChatOption } from '@/app/chat'

/**
 * Định nghĩa cấu trúc options cho "Tìm theo loại món"
 */
export function getFindByTypeOptions(): ChatOption[] {
  return [
    {
      id: 'target',
      label: 'Mục tiêu',
      type: 'radio',
      options: [
        { value: 'an-uong', label: 'Ăn uống' },
        { value: 'hen-ho', label: 'Hẹn hò' },
        { value: 'gia-dinh', label: 'Gia đình' },
        { value: 'ban-be', label: 'Bạn bè' },
        { value: 'tu-tap', label: 'Tụ tập' },
      ],
    },
    {
      id: 'buoi',
      label: 'Buổi trong ngày',
      type: 'radio',
      options: [
        { value: 'sang', label: 'Sáng' },
        { value: 'trua', label: 'Trưa' },
        { value: 'chieu', label: 'Chiều' },
        { value: 'toi', label: 'Tối' },
      ],
    },
    {
      id: 'soNguoi',
      label: 'Số người',
      type: 'radio',
      options: [
        { value: '1-2', label: '1-2 người' },
        { value: '3-4', label: '3-4 người' },
        { value: '5-6', label: '5-6 người' },
        { value: '7+', label: '7+ người' },
      ],
    },
    {
      id: 'loaiMon',
      label: 'Loại món',
      type: 'checkbox',
      options: [
        { value: 'chay', label: 'Chay' },
        { value: 'viet-nam', label: 'Việt Nam' },
        { value: 'a', label: 'Á' },
        { value: 'au', label: 'Âu' },
        { value: 'nhat', label: 'Nhật' },
        { value: 'han', label: 'Hàn' },
        { value: 'thai', label: 'Thái' },
        { value: 'khac', label: 'Khác' },
      ],
    },
    {
      id: 'mucGia',
      label: 'Mức giá',
      type: 'radio',
      options: [
        { value: 'binh-dan', label: 'Bình dân' },
        { value: 'tam-trung', label: 'Tầm trung' },
        { value: 'cao-cap', label: 'Cao cấp' },
      ],
    },
    {
      id: 'khongGian',
      label: 'Không gian',
      type: 'radio',
      options: [
        { value: 'yen-tinh', label: 'Yên tĩnh' },
        { value: 'soi-dong', label: 'Sôi động' },
        { value: 'view-dep', label: 'View đẹp' },
        { value: 'cho-choi-tre-em', label: 'Có chỗ chơi cho trẻ em' },
      ],
    },
  ]
}

/**
 * Build prompt từ selections để gửi cho AI
 */
export function buildPromptFromSelections(selections: Record<string, string | string[]>): string {
  const parts: string[] = []

  if (selections.target) {
    const targetLabels: Record<string, string> = {
      'an-uong': 'Ăn uống',
      'hen-ho': 'Hẹn hò',
      'gia-dinh': 'Gia đình',
      'ban-be': 'Bạn bè',
      'tu-tap': 'Tụ tập',
    }
    parts.push(`Mục tiêu: ${targetLabels[selections.target as string] || selections.target}`)
  }

  if (selections.buoi) {
    const buoiLabels: Record<string, string> = {
      sang: 'Sáng',
      trua: 'Trưa',
      chieu: 'Chiều',
      toi: 'Tối',
    }
    parts.push(`Buổi: ${buoiLabels[selections.buoi as string] || selections.buoi}`)
  }

  if (selections.soNguoi) {
    parts.push(`Số người: ${selections.soNguoi}`)
  }

  if (selections.loaiMon && Array.isArray(selections.loaiMon) && selections.loaiMon.length > 0) {
    const loaiMonLabels: Record<string, string> = {
      chay: 'Chay',
      'viet-nam': 'Việt Nam',
      a: 'Á',
      au: 'Âu',
      nhat: 'Nhật',
      han: 'Hàn',
      thai: 'Thái',
      khac: 'Khác',
    }
    const labels = selections.loaiMon.map((v) => loaiMonLabels[v] || v).join(', ')
    parts.push(`Loại món: ${labels}`)
  }

  if (selections.mucGia) {
    const mucGiaLabels: Record<string, string> = {
      'binh-dan': 'Bình dân',
      'tam-trung': 'Tầm trung',
      'cao-cap': 'Cao cấp',
    }
    parts.push(`Mức giá: ${mucGiaLabels[selections.mucGia as string] || selections.mucGia}`)
  }

  if (selections.khongGian) {
    const khongGianLabels: Record<string, string> = {
      'yen-tinh': 'Yên tĩnh',
      'soi-dong': 'Sôi động',
      'view-dep': 'View đẹp',
      'cho-choi-tre-em': 'Có chỗ chơi cho trẻ em',
    }
    parts.push(`Không gian: ${khongGianLabels[selections.khongGian as string] || selections.khongGian}`)
  }

  return `Tìm quán ăn phù hợp với: ${parts.join(', ')}`
}

