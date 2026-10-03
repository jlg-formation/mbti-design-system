import { expect, test, type Page } from '@playwright/test';

const rootVar = (page: Page, name: string) =>
  page.evaluate((n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim(), name);

const axisValue = (page: Page, axis: string) =>
  page.locator(`input[data-axis="${axis}"]`).evaluate((el) => Number((el as HTMLInputElement).value));

async function setAxis(page: Page, axis: string, value: number) {
  await page.locator(`input[data-axis="${axis}"]`).fill(String(value));
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.goto('./');
});

test('moving a slider updates the CSS variables on :root', async ({ page }) => {
  const before = await rootVar(page, '--radius-a');
  const accentBefore = await rootVar(page, '--color-accent');
  await setAxis(page, 'tf', 100);
  await expect.poll(() => rootVar(page, '--radius-a')).not.toBe(before);
  expect(await rootVar(page, '--color-accent')).not.toBe(accentBefore);
  await setAxis(page, 'jp', 100);
  await expect.poll(() => rootVar(page, '--chaos')).toBe('1');
});

test('no infinite animation keeps running at rest, even at N+P extremes', async ({ page }) => {
  await setAxis(page, 'sn', 100);
  await setAxis(page, 'jp', 100);
  await expect.poll(() => rootVar(page, '--chaos')).toBe('1');
  await page.waitForTimeout(1000);
  const infinite = await page.evaluate(
    () => document.getAnimations().filter((a) => a.effect?.getTiming().iterations === Infinity).length,
  );
  expect(infinite).toBe(0);
});

test('profile shortcuts, random and reset move the sliders', async ({ page }) => {
  await page.getByRole('button', { name: 'INFP', exact: true }).click();
  await expect.poll(() => axisValue(page, 'ei')).toBeCloseTo(85, 0);
  await expect(page.getByTestId('portrait')).toContainText('INFP');
  for (const a of ['sn', 'tf', 'jp']) expect(await axisValue(page, a)).toBeCloseTo(85, 0);

  await page.getByRole('button', { name: 'ESTJ', exact: true }).click();
  await expect.poll(() => axisValue(page, 'ei')).toBeCloseTo(15, 0);
  await expect(page.getByTestId('portrait')).toContainText('ESTJ');

  await page.getByRole('button', { name: 'Réinitialiser' }).click();
  await expect.poll(() => axisValue(page, 'ei')).toBeCloseTo(50, 0);
  for (const a of ['sn', 'tf', 'jp']) expect(await axisValue(page, a)).toBeCloseTo(50, 0);

  await page.getByRole('button', { name: 'Aléatoire' }).click();
  await page.waitForTimeout(900);
  const values = await Promise.all(['ei', 'sn', 'tf', 'jp'].map((a) => axisValue(page, a)));
  expect(values.some((v) => Math.abs(v - 50) > 0.5)).toBe(true);
});

test('the quiz places the sliders on the computed values', async ({ page }) => {
  await page.getByRole('button', { name: 'Trouve ton profil' }).click();
  const dialog = page.getByRole('dialog', { name: 'Trouve ton profil' });
  await expect(dialog).toBeVisible();
  const submit = dialog.getByRole('button', { name: 'Voir mon interface' });
  await expect(submit).toBeDisabled();

  // Strongly agree with E, S, T, J statements; strongly disagree with the others → ESTJ at 0 %.
  const leftPole = ['q1', 'q3', 'q5', 'q7'];
  for (const id of ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8']) {
    const label = leftPole.includes(id) ? 'Tout à fait moi' : 'Pas du tout moi';
    await dialog.getByTestId(`quiz-${id}`).getByText(label, { exact: true }).click();
  }
  await submit.click();
  await expect(dialog).toBeHidden();
  await expect.poll(() => axisValue(page, 'tf')).toBe(0);
  for (const a of ['ei', 'sn', 'jp']) expect(await axisValue(page, a)).toBe(0);
  await expect(page.getByTestId('portrait')).toContainText('ESTJ');
});

test('URL parameters restore the state, and reload restores from localStorage', async ({ page }) => {
  await page.goto('./?ei=72&sn=30&tf=85&jp=40&theme=dark');
  expect(await axisValue(page, 'ei')).toBe(72);
  expect(await axisValue(page, 'tf')).toBe(85);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByTestId('portrait')).toContainText('ISFJ');

  await setAxis(page, 'sn', 90);
  await expect.poll(() => page.url()).toContain('sn=90');
  await page.goto('./');
  expect(await axisValue(page, 'sn')).toBe(90);
  expect(await axisValue(page, 'ei')).toBe(72);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('the light / dark switch changes the theme and colors', async ({ page }) => {
  await page.goto('./?theme=light');
  const bgLight = await rootVar(page, '--color-bg');
  const toggle = page.getByRole('switch', { name: 'Mode sombre' });
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect.poll(() => rootVar(page, '--color-bg')).not.toBe(bgLight);
  await expect.poll(() => page.url()).toContain('theme=dark');
});

test('export copies and downloads CSS and JSON', async ({ page }) => {
  const exportBlock = page.locator('.panel__export');

  await exportBlock.getByRole('button', { name: 'Copier' }).first().click();
  await expect(page.getByRole('status')).toHaveText('CSS copié !');
  const css = await page.evaluate(() => navigator.clipboard.readText());
  expect(css).toMatch(/^:root \{/);
  expect(css).toContain('--color-accent:');

  await exportBlock.getByRole('button', { name: 'Copier' }).nth(1).click();
  await expect(page.getByRole('status')).toHaveText('JSON copié !');
  const json = JSON.parse(await page.evaluate(() => navigator.clipboard.readText()));
  expect(json.colors['color-accent']).toMatch(/^#[0-9a-f]{6}$/);

  const [cssDownload] = await Promise.all([
    page.waitForEvent('download'),
    exportBlock.getByRole('button', { name: 'Télécharger' }).first().click(),
  ]);
  expect(cssDownload.suggestedFilename()).toMatch(/^morphing-ui-[ei][sn][tf][jp]-(light|dark)\.css$/);

  const [jsonDownload] = await Promise.all([
    page.waitForEvent('download'),
    exportBlock.getByRole('button', { name: 'Télécharger' }).nth(1).click(),
  ]);
  expect(jsonDownload.suggestedFilename()).toMatch(/\.json$/);
});

test('copy link puts the current URL in the clipboard', async ({ page }) => {
  await setAxis(page, 'ei', 10);
  await expect.poll(() => page.url()).toContain('ei=10');
  await page.getByRole('button', { name: 'Copier le lien' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('ei=10');
});
