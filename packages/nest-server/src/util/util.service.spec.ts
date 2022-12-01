import { Test, TestingModule } from '@nestjs/testing'
import { UtilService } from './util.service'

describe('DummyService', () => {
  let service: UtilService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile()

    service = module.get<UtilService>(UtilService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('array range method should work', () => {
    expect(service.isArrayInSequence([2, 3, 2])).toBe(false)
    expect(service.isArrayInSequence([2, 3, 4])).toBe(true)
    expect(service.isArrayInSequence(['2', '3', '5'])).toBe(false)
    expect(service.isArrayInSequence(['2', '3', '2'])).toBe(false)
    expect(service.isArrayInSequence(['2', '3', '4'])).toBe(true)
  })
})
