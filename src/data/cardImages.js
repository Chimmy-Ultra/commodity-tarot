/**
 * cardImages.js — Single source of truth mapping card id → image path.
 * Imported by both CardDraw (spread view) and DailyCard (daily view).
 * Cards without an entry render the suit-colored SVG fallback.
 */

export const CARD_IMAGES = {
  // Major Arcana (0–21)
  0:  '/cards/00_the_fool.png',
  1:  '/cards/01_the_magician.png',
  2:  '/cards/new_batch_c_3.png',   // High Priestess
  3:  '/cards/03_the_empress.png',
  4:  '/cards/04_the_emperor.png',
  5:  '/cards/new_batch_a_1.png',   // Hierophant
  6:  '/cards/new_batch_c_1.png',   // Lovers
  7:  '/cards/new_batch_b_2.png',   // Chariot
  8:  '/cards/new_batch_b_4.png',   // Strength
  9:  '/cards/09_the_hermit.png',
  10: '/cards/new_batch_a_3.png',   // Wheel of Fortune
  11: '/cards/new_batch_b_3.png',   // Justice
  12: '/cards/new_batch_d_1.png',   // Hanged Man
  13: '/cards/13_death.png',
  14: '/cards/new_batch_d_2.png',   // Temperance
  15: '/cards/new_batch_a_4.png',   // Devil
  16: '/cards/16_the_tower.png',
  17: '/cards/new_batch_a_2.png',   // Star
  18: '/cards/new_batch_c_2.png',   // Moon
  19: '/cards/new_batch_c_4.png',   // Sun
  20: '/cards/new_batch_b_1.png',   // Judgement
  21: '/cards/21_the_world.png',

  // Minor Arcana — generated images
  22: '/cards/minor_22_ace_of_wands.png',       // Ace of Wands
  23: '/cards/minor_23_two_of_wands.png',       // Two of Wands
  24: '/cards/minor_24_three_of_wands.png',     // Three of Wands
  26: '/cards/minor_26_five_of_wands.png',      // Five of Wands
  27: '/cards/minor_27_six_of_wands.png',       // Six of Wands
  29: '/cards/minor_29_eight_of_wands.png',     // Eight of Wands
  30: '/cards/minor_30_nine_of_wands.png',      // Nine of Wands
  32: '/cards/minor_32_page_of_wands.png',      // Page of Wands
  33: '/cards/minor_33_knight_of_wands.png',    // Knight of Wands
  34: '/cards/minor_34_queen_of_wands.png',     // Queen of Wands
  37: '/cards/minor_37_two_of_pentacles.png',   // Two of Pentacles
  39: '/cards/minor_39_four_of_pentacles.png',  // Four of Pentacles
  40: '/cards/minor_40_five_of_pentacles.png',  // Five of Pentacles
  41: '/cards/minor_41_six_of_pentacles.png',   // Six of Pentacles
  42: '/cards/minor_42_seven_of_pentacles.png', // Seven of Pentacles
  43: '/cards/minor_43_eight_of_pentacles.png',
  44: '/cards/minor_44_nine_of_pentacles.png',
  45: '/cards/minor_45_ten_of_pentacles.png',
  46: '/cards/minor_46_page_of_pentacles.png',
  47: '/cards/minor_47_knight_of_pentacles.png',
  48: '/cards/minor_48_queen_of_pentacles.png',

  // Minor Arcana — Phase A thematic mappings
  25: '/cards/minor_four_lumber.png',     // Four of Wands
  28: '/cards/minor_seven_oil.png',       // Seven of Wands
  31: '/cards/minor_ten_wands.png',       // Ten of Wands
  35: '/cards/custom_oil_tycoon.png',     // King of Wands
  36: '/cards/custom_gold_rush.png',      // Ace of Pentacles
  38: '/cards/minor_three_pentacles.png', // Three of Pentacles
  49: '/cards/minor_king_gold.png',       // King of Pentacles

  // Minor Arcana — Cups (generated)
  50: '/cards/minor_50_ace_of_cups.png',
  51: '/cards/minor_51_two_of_cups.png',
  52: '/cards/minor_52_three_of_cups.png',
  53: '/cards/minor_53_four_of_cups.png',
  54: '/cards/minor_54_five_of_cups.png',
  55: '/cards/minor_55_six_of_cups.png',
  56: '/cards/minor_56_seven_of_cups.png',
  57: '/cards/minor_57_eight_of_cups.png',
  58: '/cards/custom_coffee_harvest.png', // Nine of Cups
  59: '/cards/minor_59_ten_of_cups.png',
  60: '/cards/minor_60_page_of_cups.png',
  61: '/cards/minor_61_knight_of_cups.png',
  62: '/cards/minor_62_queen_of_cups.png',
  63: '/cards/minor_63_king_of_cups.png',

  // Minor Arcana — Swords (generated)
  65: '/cards/minor_65_two_of_swords.png',
  66: '/cards/minor_66_three_of_swords.png',
  67: '/cards/minor_67_four_of_swords.png',
  68: '/cards/minor_68_five_of_swords.png',
  69: '/cards/minor_69_six_of_swords.png',
  71: '/cards/minor_71_eight_of_swords.png',
  72: '/cards/minor_72_nine_of_swords.png',
  73: '/cards/minor_73_ten_of_swords.png',
  74: '/cards/minor_74_page_of_swords.png',
  75: '/cards/minor_75_knight_of_swords.png',
  76: '/cards/minor_76_queen_of_swords.png',
  64: '/cards/minor_ace_wheat.png',       // Ace of Swords
  70: '/cards/minor_seven_swords.png',    // Seven of Swords
  77: '/cards/custom_grain_merchant.png', // King of Swords
}
