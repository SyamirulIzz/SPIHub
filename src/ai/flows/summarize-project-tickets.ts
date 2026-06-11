'use server';
/**
 * @fileOverview A Genkit flow for summarizing project tickets.
 *
 * - summarizeProjectTickets - A function that generates an executive summary from project ticket logs.
 * - ProjectTicketSummaryInput - The input type for the summarizeProjectTickets function.
 * - ProjectTicketSummaryOutput - The return type for the summarizeProjectTickets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectTicketSummaryInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  tickets: z.array(
    z.object({
      ticketId: z.string().describe('Unique identifier for the ticket.'),
      subject: z.string().describe('Subject or title of the ticket.'),
      description: z.string().describe('Detailed description of the issue or task.'),
      severity: z.enum(['Low', 'Medium', 'High']).describe('Severity of the ticket.'),
      status: z.string().describe('Current status of the ticket (e.g., Open, In Progress, Resolved).'),
      assignedTo: z.string().optional().describe('Name of the staff member assigned to the ticket.'),
      discussions: z.array(z.string()).optional().describe('List of discussion comments related to the ticket.'),
    })
  ).describe('An array of project tickets and their discussions.'),
});
export type ProjectTicketSummaryInput = z.infer<typeof ProjectTicketSummaryInputSchema>;

const ProjectTicketSummaryOutputSchema = z.object({
  executiveSummary: z.string().describe('A concise executive summary of the project tickets.'),
  keyIssues: z.array(z.string()).describe('A list of key issues identified from the tickets.'),
  emergingTrends: z.array(z.string()).describe('A list of emerging trends or patterns observed across the tickets.'),
  overallProjectStatus: z.string().describe('An overall assessment of the project status based on the tickets.'),
});
export type ProjectTicketSummaryOutput = z.infer<typeof ProjectTicketSummaryOutputSchema>;

export async function summarizeProjectTickets(input: ProjectTicketSummaryInput): Promise<ProjectTicketSummaryOutput> {
  return summarizeProjectTicketsFlow(input);
}

const summarizeProjectTicketsPrompt = ai.definePrompt({
  name: 'summarizeProjectTicketsPrompt',
  input: {schema: ProjectTicketSummaryInputSchema},
  output: {schema: ProjectTicketSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with generating an executive summary for a Project Lead based on project tickets and their discussions.
Your goal is to provide a concise summary that highlights key issues, emerging trends, and the overall project status.

Project Name: {{{projectName}}}

Review the following project tickets and their discussions:

{{#each tickets}}
---
Ticket ID: {{{ticketId}}}
Subject: {{{subject}}}
Severity: {{{severity}}}
Status: {{{status}}}
Assigned To: {{{assignedTo}}}
Description: {{{description}}}
{{#if discussions}}
Discussions:
{{#each discussions}}
- {{{this}}}
{{/each}}
{{/if}}
---
{{/each}}

Based on the information above, provide an executive summary, identify key issues, emerging trends, and assess the overall project status.
The output should strictly adhere to the following JSON format:
${'```json'}
{{jsonSchema ProjectTicketSummaryOutputSchema}}
${'```'}`,
});

const summarizeProjectTicketsFlow = ai.defineFlow(
  {
    name: 'summarizeProjectTicketsFlow',
    inputSchema: ProjectTicketSummaryInputSchema,
    outputSchema: ProjectTicketSummaryOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeProjectTicketsPrompt(input);
    return output!;
  }
);
