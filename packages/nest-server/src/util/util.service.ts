import { Injectable } from '@nestjs/common'

@Injectable()
export class UtilService {
  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
}
