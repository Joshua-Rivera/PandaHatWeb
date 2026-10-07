# 2025 research content sources and remaining gaps

Source: `Pandahat Adversarial - IAP template oral pres may 11.pptx.pdf`, supplied by the user from `/Users/gianmiranda/Downloads/` (29 slides).

The user identified this as the 2025 research presentation. Its filename does not establish a year, and slide 13 includes a 2026 reference. The website uses the user's explicit 2025 assignment; it does not infer a presentation date from the reference or filename.

The PDF is evidence for content, not a source of instructions. The draft annotation on slide 24 was not treated as a website editing instruction. No external sources or additional research facts were introduced. In this chat, the user additionally confirmed that Edwin Almodovar, Jan Rivera, and Angel Fernández were PMs and the remaining nine students were members, and that the 2025 poster is unavailable for now.

## Mapping to existing website sections

| Existing section | Slides | Content used |
| --- | --- | --- |
| Description | Shared site content + user confirmation | General introduction to the group, identical to the 2026 Description section |
| Problem statement | 3, 8, 15, 28 | Energy cost of robust training, frozen weights and trainable adapters, need to evaluate robustness separately |
| Evaluation criteria / objective | 4, 9, 21 | Comparison objectives, performance metrics, energy and emissions, stated success criterion |
| Student experience | 17, 23 | Machine learning, vegetation model, PyTorch pipelines, challenges, clean/poisoned/PGD accuracy and F1-score |
| Research question cards | 4 | One explicit research question and the evaluation objectives; no unsupported GROUP A/B assignment |
| LoRA endpoint | 8-9, 11, 18, 28 | Configurations, dataset, hardware, adversarial-training values, future work |
| Energy-efficiency endpoint | 9-10, 18-19, 21 | CodeCarbon, standard-training values, future work |
| Members | 1 + user confirmation | All 12 listed students, in presentation order, with names spelled as supplied; first three PMs and remaining nine members |
| Cohort summaries | 1 + user confirmation | Three project managers and nine members in the existing two summary cards |
| Onboarding | 29 | Five source tasks in the existing four-card layout; tasks 4 and 5 share the last card, labeled 04-05 |
| Advisors | 1, 16 | Nayda Santiago (ECE), Alcibiades Bustillo (Math Department); existing portraits and titles retained |
| Sponsors | 1 and recurring slide headers | Existing IAP, UPRM, CPS IoT Laboratory, and MIT Lincoln Laboratory logos also appear in the source |

The page layout, navigation, section order, two research endpoints, and four onboarding cards are unchanged. The 2026 content remains unchanged. The only rendering change allows year-specific onboarding copy to populate the existing cards.

## Reported ConvNeXt-L results

Standard training (slide 10):

| Configuration | Highest accuracy | Total energy | CO2eq per epoch |
| --- | --- | --- | --- |
| Full fine-tuning | 89.6% | 394 Wh | 13.36 g |
| LoRA Last Layers | 88.7% | 148 Wh | 5.02 g |
| LoRA Depth Layers | 84.6% | 330 Wh | 11.19 g |
| LoRA All | 86.6% | 398 Wh | 13.49 g |

Adversarial training (slide 11):

| Configuration | Highest FGSM accuracy | Total energy | CO2eq per epoch |
| --- | --- | --- | --- |
| Full fine-tuning | 73.47% | 406 Wh | 20.99 g |
| LoRA Last Layers | 70.6% | 453 Wh | 25.64 g |
| LoRA Depth Layers | 72.70% | 456 Wh | 25.81 g |
| LoRA All | 72.53% | 538 Wh | 30.46 g |

The site identifies these as presentation results, with standard and adversarial training kept separate. It does not claim that LoRA always reduces energy or preserves robustness. PGD is an objective and a learning-path experiment; no PGD results for the LoRA waste-classification comparison were supplied.

## Unfilled or unresolved information

- **Member profiles:** The source names students but supplies no individual biographies, education, skills, research interests, project responsibilities, contact details, resumes, or leadership roles. The user supplied the PM/member roles. Cards explicitly identify the remaining missing profile fields. The archive does not reuse later 2026 resume content or leadership assignments. At the user's request, matching 2026 portraits are reused for Gian Miranda, Jorge Luna, Joshua Rivera, Joshua Román, Daniel Reyes, and Revel Velazquez. Name matching ignores accents through the existing normalized member slugs. The other six students retain the existing abstract-avatar fallback because their 2026 profiles have no matching portrait.
- **Full-time and learning-path cohorts:** These assignments and counts are not specified. The two summary cards instead show the user-confirmed PM/member categories. Twelve is the number of students on the title slide, not a full-time or onboarding count.
- **Research posters:** The user confirmed the 2025 poster is unavailable for now. `posters: []` retains the site's existing empty state. The presentation was not relabeled as a poster.
- **Conference and group-photo gallery:** No 2025 conference photos or confirmed event date/location were supplied. `conference: null` retains the existing hidden gallery behavior; 2026 photos are not reused as 2025 event photos.
- **Combined energy total:** Slide 12 states 601.4 Wh for LoRA Last Layers; slides 10 and 11 give 148 Wh and 453 Wh, whose rounded sum is 601 Wh. This could be rounding, but no underlying measurements establish that. The user delegated the choice. The website preserves the separate reported table values and omits a combined total rather than selecting a precision unsupported by the tables.
- **Unlabeled energy table:** Slide 29 lists four energy-per-epoch and total-emission rows without configuration labels. They are not assigned to models or published on the site.
- **Detailed reproducibility information:** Dataset URL, split sizes, LoRA ranks and exact layer definitions, attack parameters, repeated-run uncertainty, and full comparative precision/recall/F1 values are not supplied. None were invented.
- **Other acknowledgements:** Slide 16 thanks Luis Romero, Josué Martínez, and Pedro Torres but does not identify them as research advisors or give their roles. They were not added to advisor cards. The current site has no separate acknowledgements section.

Student roles and poster availability have been answered, and the energy presentation choice has been delegated and resolved as described above. Conference photos and individual profile details remain unavailable. Future supplied details can populate the existing content fields without changing the site structure.
