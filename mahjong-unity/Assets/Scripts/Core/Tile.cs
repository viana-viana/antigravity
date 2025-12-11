using System;
using System.Collections.Generic;

namespace Mahjong.Core
{
    public enum Suit
    {
        Bamboo,     // Souzu
        Character,  // Manzu
        Dot,        // Pinzu
        Wind,       // Fonpai
        Dragon      // Sangenpai
    }

    // Specific values for Winds and Dragons to make logic easier
    public enum Wind { East = 1, South = 2, West = 3, North = 4 }
    public enum Dragon { Red = 1, Green = 2, White = 3 }

    [Serializable]
    public struct Tile : IComparable<Tile>, IEquatable<Tile>
    {
        public Suit Suit;
        public int Value; // 1-9 for suits, 1-4 for Winds, 1-3 for Dragons
        public int Id; // Unique ID (0-135) to track specific physical tiles if needed

        public Tile(Suit suit, int value, int id = -1)
        {
            Suit = suit;
            Value = value;
            Id = id;
        }

        public bool IsHonor => Suit == Suit.Wind || Suit == Suit.Dragon;
        public bool IsTerminal => !IsHonor && (Value == 1 || Value == 9);
        public bool IsSimple => !IsHonor && !IsTerminal;

        public int CompareTo(Tile other)
        {
            if (Suit != other.Suit)
                return Suit.CompareTo(other.Suit);
            return Value.CompareTo(other.Value);
        }

        public bool Equals(Tile other)
        {
            return Suit == other.Suit && Value == other.Value;
        }

        public override string ToString()
        {
            if (Suit == Suit.Wind) return ((Wind)Value).ToString();
            if (Suit == Suit.Dragon) return ((Dragon)Value).ToString();
            return $"{Suit} {Value}";
        }

        // Helper to get a unique index 0-33 for AI/Logic arrays
        // 0-8: Bamboo, 9-17: Character, 18-26: Dot, 27-30: Wind, 31-33: Dragon
        public int GetIndex()
        {
            switch (Suit)
            {
                case Suit.Bamboo: return Value - 1;
                case Suit.Character: return 9 + Value - 1;
                case Suit.Dot: return 18 + Value - 1;
                case Suit.Wind: return 27 + Value - 1;
                case Suit.Dragon: return 31 + Value - 1;
                default: return 0;
            }
        }
    }
}
