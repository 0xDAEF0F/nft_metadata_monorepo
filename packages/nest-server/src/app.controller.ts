import { Controller, All } from '@nestjs/common'
@Controller()
export class AppController {
  @All()
  hello() {
    return 'hello world'
  }
}
