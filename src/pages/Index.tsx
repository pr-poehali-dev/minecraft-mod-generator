import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type GenerationStage = 'idle' | 'textures-blocks' | 'textures-items' | 'textures-entities' | 'scripts' | 'done';

interface ModItem {
  type: 'block' | 'item' | 'entity';
  name: string;
  description: string;
}

const Index = () => {
  const [activeSection, setActiveSection] = useState<'generator' | 'downloads' | 'versions' | 'updates' | 'profile'>('generator');
  const [prompt, setPrompt] = useState('');
  const [forgeVersion, setForgeVersion] = useState('1.20.1');
  const [generationStage, setGenerationStage] = useState<GenerationStage>('idle');
  const [progress, setProgress] = useState(0);
  const [generatedItems, setGeneratedItems] = useState<ModItem[]>([]);
  const [modName, setModName] = useState('');

  const stageNames: Record<GenerationStage, string> = {
    'idle': 'Готов к генерации',
    'textures-blocks': 'Генерация текстур блоков',
    'textures-items': 'Генерация текстур предметов',
    'textures-entities': 'Генерация текстур сущностей',
    'scripts': 'Создание скриптов',
    'done': 'Готово'
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Введите описание мода');
      return;
    }

    const stages: GenerationStage[] = ['textures-blocks', 'textures-items', 'textures-entities', 'scripts', 'done'];
    const mockItems: ModItem[] = [
      { type: 'block', name: 'Магический камень', description: 'Блок с уникальными свойствами' },
      { type: 'item', name: 'Зелье силы', description: 'Увеличивает урон на 50%' },
      { type: 'entity', name: 'Огненный голем', description: 'Враждебный моб' },
      { type: 'block', name: 'Портал в измерение', description: 'Телепортирует в новый мир' },
    ];

    setModName(prompt.split(' ').slice(0, 3).join(' '));
    setGeneratedItems([]);

    for (let i = 0; i < stages.length; i++) {
      setGenerationStage(stages[i]);
      setProgress((i / stages.length) * 100);

      if (i < mockItems.length) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setGeneratedItems(prev => [...prev, mockItems[i]]);
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    setProgress(100);
    toast.success('Мод успешно сгенерирован!');
  };

  const handleDownload = () => {
    const jarContent = `# ${modName}\n\nGenerated for Forge ${forgeVersion}\n\nItems:\n${generatedItems.map(item => `- ${item.name} (${item.type}): ${item.description}`).join('\n')}`;
    
    const blob = new Blob([jarContent], { type: 'application/java-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modName.replace(/\s+/g, '-').toLowerCase()}.jar`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Мод скачан!');
  };

  const handleUpdate = () => {
    toast.info('Откроется форма для добавления новых компонентов');
  };

  const sidebarItems = [
    { id: 'generator', icon: 'Sparkles', label: 'Генератор' },
    { id: 'downloads', icon: 'Download', label: 'Загрузки' },
    { id: 'versions', icon: 'Package', label: 'Версии' },
    { id: 'updates', icon: 'RefreshCw', label: 'Обновления' },
    { id: 'profile', icon: 'User', label: 'Профиль' },
  ] as const;

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Box" className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">ModCraft</h1>
              <p className="text-xs text-sidebar-foreground/60">Generator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon name={item.icon} size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Card className="bg-sidebar-accent/30 border-sidebar-border">
            <CardContent className="p-4">
              <p className="text-xs text-sidebar-foreground/80 mb-2">Forge 1.20.1</p>
              <Badge variant="outline" className="text-xs">Активна</Badge>
            </CardContent>
          </Card>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-2">Генератор Minecraft модов</h2>
            <p className="text-muted-foreground text-lg">Создайте свой уникальный мод с помощью AI</p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Wand2" className="text-primary" size={24} />
                Создание мода
              </CardTitle>
              <CardDescription>Опишите, какой мод вы хотите создать, и выберите версию Forge</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Описание мода</label>
                <Textarea
                  placeholder="Например: Добавь магические блоки, новые биомы с драконами и систему крафта зелий..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="resize-none"
                  disabled={generationStage !== 'idle' && generationStage !== 'done'}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Версия Forge</label>
                <Select value={forgeVersion} onValueChange={setForgeVersion} disabled={generationStage !== 'idle' && generationStage !== 'done'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.20.1">Forge 1.20.1</SelectItem>
                    <SelectItem value="1.19.4" disabled>Forge 1.19.4 (скоро)</SelectItem>
                    <SelectItem value="1.18.2" disabled>Forge 1.18.2 (скоро)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {generationStage !== 'idle' && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {generationStage === 'done' ? (
                        <Icon name="CheckCircle2" className="text-green-500" size={20} />
                      ) : (
                        <Icon name="Loader2" className="animate-spin text-primary" size={20} />
                      )}
                      {stageNames[generationStage]}
                    </span>
                    <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={generationStage !== 'idle' && generationStage !== 'done'}
                  className="flex-1"
                  size="lg"
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Сгенерировать мод
                </Button>
              </div>
            </CardContent>
          </Card>

          {activeSection === 'generator' && generationStage === 'done' && generatedItems.length > 0 && (
            <Card className="border-2 border-green-500/20 bg-green-50/30 dark:bg-green-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Icon name="CheckCircle2" size={24} />
                  Готово!
                </CardTitle>
                <CardDescription>Ваш мод "{modName}" успешно создан</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">Добавленные элементы:</h3>
                  <div className="grid gap-2">
                    {generatedItems.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          item.type === 'block' ? 'bg-blue-100 dark:bg-blue-950' :
                          item.type === 'item' ? 'bg-purple-100 dark:bg-purple-950' :
                          'bg-orange-100 dark:bg-orange-950'
                        }`}>
                          <Icon
                            name={item.type === 'block' ? 'Box' : item.type === 'item' ? 'Gem' : 'Bug'}
                            size={20}
                            className={
                              item.type === 'block' ? 'text-blue-600 dark:text-blue-400' :
                              item.type === 'item' ? 'text-purple-600 dark:text-purple-400' :
                              'text-orange-600 dark:text-orange-400'
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {item.type === 'block' ? 'Блок' : item.type === 'item' ? 'Предмет' : 'Сущность'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <Button onClick={handleDownload} size="lg" className="flex-1">
                    <Icon name="Download" size={20} className="mr-2" />
                    Скачать .jar файл
                  </Button>
                  <Button onClick={handleUpdate} variant="outline" size="lg">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить новое
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'downloads' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Download" size={24} />
                  История загрузок
                </CardTitle>
                <CardDescription>Все ваши сгенерированные моды</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">Пока нет загрузок</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;