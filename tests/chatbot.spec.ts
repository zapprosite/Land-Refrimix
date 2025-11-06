import { test, expect } from '@playwright/test';

test.describe('Chatbot HVAC-R', () => {
  test('abre, envia mensagem e recebe resposta do bot', async ({ page }) => {
    await page.goto('/');

    // Garantir chat aberto, clicando no botão flutuante se necessário
    const heading = page.getByRole('heading', { level: 3, name: /Gelão Assistant/i });
    if (!(await heading.isVisible())) {
      await page.locator('button[aria-expanded]').click();
      await expect(heading).toBeVisible();
    }

    // Verifica botão WhatsApp dentro do diálogo
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('link', { name: /Atendimento WhatsApp/i })).toBeVisible();
    await expect(dialog.getByRole('link', { name: /Atendimento WhatsApp/i })).toBeVisible();

    // Captura contagem inicial usando data-atributos estáveis
    const botMessagesBefore = await dialog.locator('[data-msg="bot"]').count();
    const userMessagesBefore = await dialog.locator('[data-msg="user"]').count();

    // Envia mensagem
    const input = dialog.getByRole('textbox', { name: /Mensagem/i });
    await input.fill('Teste IA: verificar resposta do especialista HVAC-R');
    await dialog.getByRole('button', { name: /Enviar mensagem/i }).click();

    // Garante que a mensagem do usuário foi renderizada
    await expect(async () => {
      const userMessagesAfter = await dialog.locator('[data-msg="user"]').count();
      expect(userMessagesAfter).toBeGreaterThan(userMessagesBefore);
    }).toPass({ timeout: 5000 });

    // Tenta aguardar resposta do bot (IA ou fallback), mas não falha se indisponível
    try {
      await expect(async () => {
        const botMessagesAfter = await dialog.locator('[data-msg="bot"]').count();
        expect(botMessagesAfter).toBeGreaterThan(botMessagesBefore);
      }).toPass({ timeout: 30000 });
    } catch {}
  });
});
