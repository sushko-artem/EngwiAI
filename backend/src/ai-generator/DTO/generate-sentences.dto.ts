import { IsNumber, IsString, Max, Min } from 'class-validator';

export class GenerateSentencesDto {
  @IsString()
  id!: string;

  @IsString()
  cardSide!: 'word' | 'translation';

  @IsNumber()
  @Min(5)
  @Max(10)
  count!: number;

  @IsString()
  difficulty!: 'beginner' | 'intermediate' | 'advanced';
}
