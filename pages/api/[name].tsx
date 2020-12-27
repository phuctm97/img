import type { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { name },
  } = req;

  res.status(200).json({ name });
};
