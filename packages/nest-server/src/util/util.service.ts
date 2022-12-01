import { Injectable } from '@nestjs/common'
import is_number from 'is-number'

@Injectable()
export class UtilService {
  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  isArrayInSequence(ra: Array<number | string>) {
    return ra.every((num, idx, arr) => {
      if (!is_number(num)) return false
      if (idx === 0) return true
      if (+num === +arr[idx - 1] + 1) return true
      return false
    })
  }
}
