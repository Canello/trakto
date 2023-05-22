import { IsUrl, IsNumber, Max, Min } from 'class-validator';

export class HandleImageDto {
  @IsUrl()
  image: string;

  @IsNumber()
  @Max(0.99)
  @Min(0)
  compress: number;
}
