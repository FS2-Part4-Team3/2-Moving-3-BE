import { ModelBase } from '#types/common.types.js';
import { Question as PrismaQuestion } from '@prisma/client';

interface PrismaQuestionBase extends Omit<PrismaQuestion, keyof ModelBase> {}
interface QuestionBase extends PrismaQuestionBase {}

export interface Question extends QuestionBase, ModelBase {}

export interface QuestionInputDTO extends Omit<Question, keyof ModelBase> {}
