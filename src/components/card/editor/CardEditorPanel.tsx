"use client"

import type { CardData, CardStage, CardType, RarityLevel, CardStats, CardMove, CardTemplate, HoloEffectId, CardFont } from "@/types/card"
import type { CharCounts } from "@/hooks/use-card-builder"
import { CARD_STAGES } from "@/lib/card/constants"
import { Shuffle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EditorSection } from "./EditorSection"
import { TemplateSelector } from "./TemplateSelector"
import { HoloSelector } from "./HoloSelector"
import { FontSelector } from "./FontSelector"
import { TypeSelector } from "./TypeSelector"
import { RaritySelector } from "./RaritySelector"
import { StatSlider } from "./StatSlider"
import { ImageUploadSection } from "./ImageUploadSection"

interface CardEditorPanelProps {
  card: CardData
  charCounts: CharCounts
  onField: <K extends keyof CardData>(key: K, value: CardData[K]) => void
  onStat: (stat: keyof CardStats, value: number) => void
  onMove: (index: 0 | 1, field: keyof CardMove, value: string | number) => void
  onType: (type: CardType) => void
  onStage: (stage: CardStage) => void
  onRarity: (rarity: RarityLevel) => void
  onImage: (url: string) => void
  onTemplate: (template: CardTemplate) => void
  onHolo: (holo: HoloEffectId) => void
  onHoloStrength: (strength: number) => void
  onFont: (font: CardFont) => void
  onRandomize: () => void
}

export function CardEditorPanel(props: CardEditorPanelProps) {
  const {
    card, charCounts, onField, onStat, onMove, onType, onStage, onRarity, onImage,
    onTemplate, onHolo, onHoloStrength, onFont, onRandomize,
  } = props

  const strengthPct = Math.round((card.holoStrength ?? 0.7) * 100)

  return (
    <div className="space-y-1">
      <div className="mb-6 flex items-center justify-between gap-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/70">
          Card Builder
        </p>
        <Button variant="outline" size="sm" onClick={onRandomize} className="h-7 gap-1.5 text-xs">
          <Shuffle className="h-3.5 w-3.5" />
          Surprise me
        </Button>
      </div>

      {/* Template */}
      <EditorSection title="Template">
        <TemplateSelector value={card.template ?? "classic"} onChange={onTemplate} />
      </EditorSection>

      {/* Font */}
      <EditorSection title="Font">
        <FontSelector value={card.font ?? "classic"} onChange={onFont} />
      </EditorSection>

      {/* Holographic effect */}
      <EditorSection title="Holographic Effect">
        <HoloSelector value={card.holo ?? "none"} onChange={onHolo} />
        <div className="mt-3 flex items-center gap-2.5">
          <span className="w-14 shrink-0 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Strength
          </span>
          <Slider
            value={[strengthPct]}
            min={0}
            max={100}
            step={1}
            onValueChange={(v) => onHoloStrength((v[0] ?? 70) / 100)}
            className="flex-1"
            disabled={(card.holo ?? "none") === "none"}
          />
          <span className="w-9 shrink-0 text-right font-mono text-[11px] text-foreground">
            {strengthPct}%
          </span>
        </div>
      </EditorSection>

      {/* Identity */}
      <EditorSection title="Identity">
        <div className="space-y-3.5">
          <div className="space-y-1.5">
            <Label className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>Pet Name</span>
              <span className="text-[10px] text-muted-foreground/60">{charCounts.name}/18</span>
            </Label>
            <Input
              maxLength={18}
              placeholder="e.g. Mochi, Luna, Biscuit"
              value={card.name === "Pet Name" ? "" : card.name}
              onChange={(e) => onField("name", e.target.value || "Pet Name")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>Species / Breed</span>
              <span className="text-[10px] text-muted-foreground/60">{charCounts.species}/22</span>
            </Label>
            <Input
              maxLength={22}
              placeholder="e.g. Golden Retriever"
              value={card.species === "Species · Breed" ? "" : card.species}
              onChange={(e) => onField("species", e.target.value || "Species · Breed")}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="font-mono text-xs text-muted-foreground">Stage</Label>
            <Select value={card.stage} onValueChange={(v) => onStage(v as CardStage)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CARD_STAGES.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage.charAt(0) + stage.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </EditorSection>

      {/* Type */}
      <EditorSection title="Type">
        <TypeSelector value={card.type} onChange={onType} />
      </EditorSection>

      {/* Rarity */}
      <EditorSection title="Rarity">
        <RaritySelector value={card.rarity} onChange={onRarity} />
      </EditorSection>

      {/* Photo */}
      <EditorSection title="Pet Photo">
        <ImageUploadSection imageUrl={card.imageUrl} onImage={onImage} />
      </EditorSection>

      {/* Stats */}
      <EditorSection title="Stats">
        <div className="space-y-2.5">
          <StatSlider label="HP" value={card.stats.hp} min={30} max={250} step={10} onChange={(v) => onStat("hp", v)} />
          <StatSlider label="ATK" value={card.stats.atk} min={0} max={200} step={5} onChange={(v) => onStat("atk", v)} />
          <StatSlider label="DEF" value={card.stats.def} min={0} max={200} step={5} onChange={(v) => onStat("def", v)} />
          <StatSlider label="SPD" value={card.stats.spd} min={0} max={200} step={5} onChange={(v) => onStat("spd", v)} />
        </div>
      </EditorSection>

      {/* Moves */}
      <EditorSection title="Moves" hint="Name · Energy cost (1–4) · Damage">
        <div className="space-y-2">
          {([0, 1] as const).map((i) => (
            <div key={i} className="grid grid-cols-[1fr_64px_64px] gap-1.5">
              <Input
                maxLength={18}
                placeholder="Move name"
                value={card.moves[i].name}
                onChange={(e) => onMove(i, "name", e.target.value)}
              />
              <Input
                type="number"
                min={1}
                max={4}
                className="text-center font-mono"
                value={card.moves[i].cost}
                onChange={(e) => onMove(i, "cost", e.target.value)}
              />
              <Input
                type="number"
                min={0}
                max={300}
                className="text-center font-mono"
                value={card.moves[i].damage}
                onChange={(e) => onMove(i, "damage", e.target.value)}
              />
            </div>
          ))}
        </div>
      </EditorSection>

      {/* Flavor */}
      <EditorSection title="Flavor Text">
        <div className="space-y-1.5">
          <Label className="flex items-center justify-between font-mono text-xs text-muted-foreground">
            <span>Card description</span>
            <span className="text-[10px] text-muted-foreground/60">{charCounts.flavor}/80</span>
          </Label>
          <Textarea
            maxLength={80}
            placeholder="A short fun fact or flavor text about your pet..."
            value={card.flavor}
            onChange={(e) => onField("flavor", e.target.value)}
            className="min-h-[72px] resize-none"
          />
        </div>
      </EditorSection>

      {/* Card Number */}
      <EditorSection title="Card Number">
        <div className="space-y-1.5">
          <Label className="font-mono text-xs text-muted-foreground">Set number</Label>
          <Input
            maxLength={10}
            placeholder="001/100"
            value={card.cardNumber}
            onChange={(e) => onField("cardNumber", e.target.value)}
          />
        </div>
      </EditorSection>
    </div>
  )
}
