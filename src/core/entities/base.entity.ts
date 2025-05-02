export abstract class BaseEntity {
    protected id?: string;
    protected created_at?: Date;
    protected updated_at?: Date;

    public getId(): string | undefined {
        return this.id;
    }

    public getCreatedAt(): Date | undefined {
        return this.created_at;
    }

    public getUpdatedAt(): Date | undefined {
        return this.updated_at;
    }
}