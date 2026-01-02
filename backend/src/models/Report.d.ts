import mongoose, { Document } from "mongoose";
export interface IReport extends Document {
    userId: string;
    type: string;
    description: string;
    location: string;
    date: Date;
    status: string;
}
declare const _default: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport, {}, mongoose.DefaultSchemaOptions> & IReport & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, IReport>;
export default _default;
//# sourceMappingURL=Report.d.ts.map