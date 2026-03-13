import type { FC } from "react";
import React from "react";

const possibleSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const possibleColors = ['Red', 'Blue', 'Green']
const possibleGen = ['Men', 'Women']


interface Props {
    selectedSize: string;
    selectedGen?: (size: string) => void;
    onSizeChange?: (size: string) => void;
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
    } as React.CSSProperties,
    button: (isSelected: boolean) => ({
        padding: '8px 16px',
        border: '1.5px solid',
        borderColor: isSelected ? '#111827' : '#d1d5db',
        borderRadius: '8px',
        backgroundColor: isSelected ? '#111827' : '#ffffff',
        color: isSelected ? '#ffffff' : '#374151',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: isSelected ? 700 : 400,
        transition: 'all 0.18s',
        whiteSpace: 'nowrap' as const,
    }) as React.CSSProperties,
};


export const GenSelector:FC<Props> = ({ selectedSize, onSizeChange}) => {
    return (
        <div style={ styles.container }>
            {
                possibleGen.map(gen => (
                    <button key={ gen } 
                            onClick={ () => onSizeChange && onSizeChange(selectedSize === gen ? 'none' : gen) }
                            style={ styles.button(selectedSize === gen) }
                            className="selector-btn"
                    >
                        {gen}
                    </button>
                ))  
            }
        </div>
    )
}

export const ColorSelector:FC<Props> = ({ selectedSize, onSizeChange }) => {
    return (
        <div style={ styles.container }>
            {
                possibleColors.map(color => (
                    <button key={ color } 
                            onClick={ () => onSizeChange && onSizeChange(selectedSize === color ? 'none' : color) }
                            style={ styles.button(selectedSize === color) }
                            className="selector-btn"
                        >
                        {color}
                    </button>
                ))  
            }
        </div>
    )
}

export const SizeSelector:FC<Props> = ({ selectedSize, onSizeChange }) => {
  return (
    <div style={ styles.container }>
        {
            possibleSizes.map(size => (
                <button key={ size } 
                        onClick={ () => onSizeChange && onSizeChange(selectedSize === size ? 'none' : size) }
                        style={ styles.button(selectedSize === size) }
                        className="selector-btn"
                >
                    {size}
                </button>
            ))  
        }
    </div>
    )
}