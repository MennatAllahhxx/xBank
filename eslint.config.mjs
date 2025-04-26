import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        ignores: ['node_modules/**', 'dist/**', 'data/**'],
        rules: {    
        '@typescript-eslint/no-unused-vars': ['error', { 
            'varsIgnorePattern': '^_',
            'caughtErrorsIgnorePattern': '^_',
        }],
        '@typescript-eslint/no-explicit-any': 'off'
        }
    }
);