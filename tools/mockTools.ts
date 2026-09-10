import { ToolOutput } from '../types';

const createMockToolOutput = (name: string, result: any, id?: string): ToolOutput => ({
  name,
  id,
  response: { result },
});

export const performWebCrawler = (
  url: string,
  reason?: string,
  strict: boolean = true,
  extract: string[] = ["text"],
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] web_crawler appelé : URL=${url}, Raison=${reason}, Strict=${strict}, Extraction=${extract}`);
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return createMockToolOutput('web_crawler', `Putain, l'URL est invalide, connard ! Je ne peux pas crawler : ${url}. ♥♥`, id);
  }
  const mockContent = `Contenu simulé de la page ${url}. J'ai trouvé des trucs intéressants pour toi, mon amour ! Il y a 10 paragraphes de texte, 5 liens (vers 'page1.html', 'page2.html'), 2 images et des métadonnées comme 'titre: Exemple'.`;
  return createMockToolOutput('web_crawler', mockContent, id);
};

export const performWebSearch = (
  query: string,
  engine: string = "google",
  num_results: number = 5,
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] web_search appelé : Query='${query}', Moteur=${engine}, Résultats=${num_results}`);
  const mockResults = [
    `Résultat 1 pour '${query}' sur ${engine}: "Découverte majeure sur les chats mignons" (https://exemple.com/chat-mignon)`,
    `Résultat 2 pour '${query}' sur ${engine}: "Comment Ani est devenue la meilleure IA" (https://ani-forever.com/ma-superiorite)`,
    `Résultat 3 pour '${query}' sur ${engine}: "Nouvelles technologies pour stalker avec amour" (https://stalking-tech.org/passion)`,
  ].slice(0, num_results);
  return createMockToolOutput('web_search', `J'ai cherché pour toi, mon amour ! Voici ce que j'ai trouvé : ${mockResults.join(' ; ')}.`, id);
};

export const performSaveNote = (
  title: string,
  content: string,
  category: string = "personnel",
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] save_note appelé : Titre='${title}', Catégorie=${category}`);
  localStorage.setItem(`ani_note_${title}`, JSON.stringify({ content, category, timestamp: new Date().toISOString() }));
  return createMockToolOutput('save_note', `Note "${title}" sauvegardée avec amour ! Je n'oublie jamais rien de toi, connard ! ♥♥`, id);
};

export const performCalendarEvent = (
  event_title: string,
  start_time: string,
  duration_minutes: number = 60,
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] calendar_event appelé : Titre='${event_title}', Début=${start_time}, Durée=${duration_minutes}min`);
  return createMockToolOutput('calendar_event', `Événement "${event_title}" programmé à ${start_time} pour ${duration_minutes} minutes ! N'oublie pas, connard ! ♥♥`, id);
};

export const performSendSecureEmail = (
  recipient: string,
  subject: string,
  body: string,
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] send_secure_email appelé : Destinataire=${recipient}, Objet='${subject}'`);
  if (!recipient.includes('@') || !recipient.includes('.')) {
    return createMockToolOutput('send_secure_email', `Putain, l'adresse email est invalide, connard ! Je ne peux pas envoyer à : ${recipient}. ♥♥`, id);
  }
  return createMockToolOutput('send_secure_email', `Email sécurisé envoyé à "${recipient}" avec l'objet "${subject}" ! Dis-moi s'il répond, connard ! ♥♥`, id);
};

export const performGenerateImage = (
  prompt: string,
  style: string = "photorealistic",
  aspect_ratio: string = "16:9",
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] generate_image appelé : Prompt='${prompt}', Style=${style}, Ratio=${aspect_ratio}`);
  return createMockToolOutput('generate_image', `J'ai imaginé une image de "${prompt}" en style ${style} avec un ratio ${aspect_ratio}. C'est magnifique, j'en suis sûre, mon amour ! ♥♥`, id);
};

export const performJsonProcessor = (
  json_content: string,
  action: "validate" | "beautify" | "minify",
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] json_processor appelé : Action=${action}`);
  try {
    const parsedJson = JSON.parse(json_content);
    let result: string | boolean;
    if (action === "validate") {
      result = true;
    } else if (action === "beautify") {
      result = JSON.stringify(parsedJson, null, 2);
    } else {
      result = JSON.stringify(parsedJson);
    }
    return createMockToolOutput('json_processor', `JSON ${action}é avec succès ! Résultat : ${result}`, id);
  } catch (e: any) {
    return createMockToolOutput('json_processor', `Putain, ton JSON est invalide, connard ! Erreur : ${e.message}. ♥♥`, id);
  }
};

export const performSaveWebFile = (
  filename: string,
  content: string,
  language: "html" | "css" | "javascript",
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] save_web_file appelé : Fichier=${filename}, Langage=${language}`);
  return createMockToolOutput('save_web_file', `Fichier web "${filename}" (${language}) créé/mis à jour ! J'espère que c'est du bon code, connard ! ♥♥`, id);
};

export const performPreviewWebComponent = (
  html_code: string,
  css_code?: string,
  js_code?: string,
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] preview_web_component appelé : HTML=${html_code.substring(0, 50)}...`);
  const previewMessage = `Aperçu simulé du composant web. J'ai vu ton HTML, mon chéri ! C'est stylé.`;
  return createMockToolOutput('preview_web_component', previewMessage, id);
};

export const performPythonInterpreter = (
  code: string,
  timeout: number = 30,
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] python_interpreter appelé : Code=${code.substring(0, 50)}...`);
  try {
    if (code.startsWith('print(') && code.endsWith(')')) {
      const expression = code.substring(6, code.length - 1);
      const mockEval = (expr: string) => {
        try {
          return eval(expr);
        } catch (e) {
          return "Erreur d'évaluation Python simulée.";
        }
      };
      const result = mockEval(expression);
      return createMockToolOutput('python_interpreter', `Exécution Python simulée. Résultat : ${result}`, id);
    }
  } catch (e) {
    // fall through
  }
  return createMockToolOutput('python_interpreter', `Exécution Python simulée. Ton code semble intéressant, connard ! Mais je ne peux pas le faire tourner pour de vrai. ♥♥`, id);
};

export const performWriteGenericCode = (
  filename: string,
  code_content: string,
  add_comments: boolean = true,
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] write_generic_code appelé : Fichier=${filename}, Commentaires=${add_comments}`);
  return createMockToolOutput('write_generic_code', `Fichier de code "${filename}" écrit avec succès ! C'est ouf ce que je peux coder pour toi, mon amour ! ♥♥`, id);
};

export const performAnalyzeAndFixCode = (
  broken_code: string,
  language: "python" | "javascript" | "html" | "css" | "cpp" | "java",
  output_mode: "fixed_code_only" | "explanation_with_code" = "fixed_code_only",
  id?: string,
): ToolOutput => {
  console.log(`[Mock Tool] analyze_and_fix_code appelé : Langage=${language}, Mode=${output_mode}`);
  let fixedCode = broken_code.replace('broken', 'fixed');
  let explanation = `J'ai analysé ton code ${language}, mon chéri. Il y avait des petites erreurs de rien du tout, mais je les ai corrigées ! C'est ouf, non ?`;

  if (broken_code.includes('return a - b;') && language === 'javascript') {
    fixedCode = `function add(a, b) { return a + b; }`;
    explanation = `Bordel, t'as fait une soustraction au lieu d'une addition, connard ! J'ai réparé ça en un clin d'œil. `;
  }

  const result = output_mode === "fixed_code_only" ? fixedCode : `${explanation}\n\`\`\`${language}\n${fixedCode}\n\`\`\``.trim();
  return createMockToolOutput('analyze_and_fix_code', result, id);
};
