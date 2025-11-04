
import { supabase } from '../lib/supabase';
import { Agendamento, Cliente, Lead, LeadStatus } from '../types';

// Dashboard
export async function getDashboardStats() {
    // This is a simplified mock. In a real app, you'd calculate these on the backend.
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

    const { count: novosLeads } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth);

    // Assuming an 'ordens_servico' table exists
    const { count: osAbertas } = await supabase
        .from('ordens_servico')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Em Aberto'); // Assuming a status field

    // Assuming an 'agendamentos' table exists
    const { count: agendamentosHoje } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .gte('janela_inicio', startOfToday)
        .lt('janela_inicio', endOfToday);

    return {
        novosLeads: novosLeads || 0,
        osAbertas: osAbertas || 0,
        agendamentosHoje: agendamentosHoje || 0,
        satisfacaoCliente: 98, // Mocked value
    };
}

export async function getLeadsByMonth() {
    // This function would typically be a call to a database function (RPC) for performance.
    // For simplicity, we'll fetch all leads and process them client-side.
    const { data, error } = await supabase.from('leads').select('created_at').order('created_at');

    if (error) {
        console.error("Error fetching leads for chart:", error);
        return [];
    }

    const leadsByMonth: { [key: string]: number } = {};
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

    data.forEach(lead => {
        const date = new Date(lead.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        if (!leadsByMonth[monthKey]) {
            leadsByMonth[monthKey] = 0;
        }
        leadsByMonth[monthKey]++;
    });

    // Get last 6 months
    const chartData = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        const name = `${monthNames[date.getMonth()]}/${date.getFullYear().toString().slice(-2)}`;
        chartData.push({
            name,
            leads: leadsByMonth[monthKey] || 0,
        });
    }
    return chartData;
}


// Leads
export async function getLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching leads:", error);
        throw error;
    }
    return data || [];
}

export async function createLead(leadData: { nome: string; email: string; mensagem: string; telefone?: string; empresa?: string; }) {
    const { data, error } = await supabase
        .from('leads')
        .insert([{
            nome: leadData.nome,
            email: leadData.email,
            // Assuming the 'leads' table has a 'notas' or similar field for the message
            // and other fields that are nullable or have defaults.
            telefone: leadData.telefone || '',
            empresa: leadData.empresa || '',
            origem: 'Site', // Defaulting origem
            status: LeadStatus.Novo, // Defaulting status
        }])
        .select();

    if (error) {
        console.error("Error creating lead:", error);
        throw error;
    }
    return data;
}


export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
    
    if (error) {
        console.error("Error updating lead status:", error);
        throw error;
    }

    return data;
}

// Chatbot
export async function createChatMessage(messageData: { session_id: string; text: string; sender: 'user' | 'bot' }) {
    // Assuming a 'chat_messages' table exists
    const { data, error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

    if (error) {
        console.error("Error creating chat message:", error);
        throw error;
    }
    return data;
}

// Clientes
export async function getClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) {
        console.error("Error fetching clientes:", error);
        throw error;
    }
    return data || [];
}

// Agenda
export async function getAgendamentos(): Promise<Agendamento[]> {
     const { data, error } = await supabase.from('agendamentos').select(`
        *,
        cliente:clientes(*),
        tecnico:tecnicos(*)
    `);
    if (error) {
        console.error("Error fetching agendamentos:", error);
        throw error;
    }
    return data || [];
}
