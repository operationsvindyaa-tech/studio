"use server";

import { answerQuestions } from "@/ai/flows/answer-questions";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type State = {
    messages: Message[];
};

export async function askQuestion(
  prevState: State,
  formData: FormData
): Promise<State> {
  const question = formData.get("question") as string;

  if (!question) {
    return prevState;
  }

  const userMessage: Message = { role: "user", content: question };

  const knowledgeBase = `
    - Campus visiting hours are from 9 AM to 6 PM on weekdays.
    - The library is open 24/7 during exam weeks. Regular hours are 8 AM to 11 PM.
    - To reset your student portal password, visit the IT helpdesk in Building C, Room 101.
    - Course registration for the fall semester begins on August 1st.
    - The campus gym is located in the Student Life Center and is free for all enrolled students.
    - The main cafeteria is located in the student union building and offers a variety of food options.
    - The next holiday is Labor day. The campus will be closed.
    `;

  try {
    const result = await answerQuestions({
      question,
      knowledgeBase,
    });
    
    const assistantMessage: Message = { role: "assistant", content: result.answer };
    return {
      messages: [...prevState.messages, userMessage, assistantMessage],
    };
  } catch (error) {
    const errorMessage: Message = { role: "assistant", content: "Sorry, I couldn't process your request right now. Please try again later." };
    return {
        messages: [...prevState.messages, userMessage, errorMessage]
    }
  }
}
